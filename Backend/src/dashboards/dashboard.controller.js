// src/tableros/tablero.controller.js
import { getLocalRecommendations } from '../../utils/searchEngine.js'
import { formatMarkdownText } from '../../utils/helpers.js'
import { consultarGeminiEnServidor } from '../../utils/geminiClient.js'
import { buildLightweightCatalog, formatChatHistoryForGemini } from '../../utils/contextBuilder.js'
import Dashboard from './dashboard.model.js';
import Synonyms from '../synonyms/synonyms.model.js'
import RawData from '../raw_data/rawdata.model.js';

// ==========================================
// 1. OBTENER TODOS (Listar)
// ==========================================
export const getDashboards = async (req, res) => {
    try {
        // Usamos .lean() para que la consulta sea más rápida al devolver objetos puros JS
        const dashboards = await Dashboard.find().lean();

        return res.status(200).json({
            message: "Tableros obtenidos exitosamente",
            data: dashboards
        });
    } catch (error) {
        console.error("Error al obtener tableros desde MongoDB: ", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

// ==========================================
// 2. OBTENER POR ID (Buscar uno específico)
// ==========================================
export const getDashboardById = async (req, res) => {
    try {
        const { id } = req.params;
        const dashboard = await Dashboard.findById(id).lean();

        if (!dashboard) {
            return res.status(404).json({ message: "Tablero no encontrado" });
        }

        return res.status(200).json({
            message: "Tablero obtenido exitosamente",
            data: dashboard
        });
    } catch (error) {
        console.error("Error al buscar tablero por ID: ", error);
        return res.status(500).json({ message: "Error al buscar el tablero. Verifica el formato del ID." });
    }
};

// ==========================================
// 3. AGREGAR (Crear)
// ==========================================
export const addDashboard = async (req, res) => {
    try {
        // Recibimos todo el cuerpo de la petición
        const { codigo, nombre, url, ...restoDeDatos } = req.body;

        // Validamos los campos que marcaste como 'required: true' en el modelo
        if (!codigo || !nombre || !url) {
            return res.status(400).json({ 
                message: "Los campos 'codigo', 'nombre' y 'url' son obligatorios" 
            });
        }

        // Creamos el registro en la BD
        const nuevoDashboard = await Dashboard.create({
            codigo,
            nombre,
            url,
            ...restoDeDatos // Esto inserta automáticamente los arrays (preguntas, kpis, etc.) si vienen en el body
        });

        return res.status(201).json({
            message: "Tablero creado exitosamente",
            data: nuevoDashboard
        });
    } catch (error) {
        console.error("Error al crear tablero: ", error);
        // Manejo de error si intentan meter un 'codigo' que ya existe (unique: true)
        if (error.code === 11000) {
            return res.status(400).json({ message: "Ya existe un tablero con ese código" });
        }
        return res.status(500).json({ message: "Error al crear el tablero" });
    }
};

// ==========================================
// 4. EDITAR (Actualizar)
// ==========================================
export const updateDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        const datosAActualizar = req.body;

        // { new: true } devuelve el documento actualizado
        // { runValidators: true } asegura que las reglas de tu esquema (ej. required) se respeten al editar
        const dashboardActualizado = await Dashboard.findByIdAndUpdate(
            id, 
            datosAActualizar, 
            { new: true, runValidators: true }
        );

        if (!dashboardActualizado) {
            return res.status(404).json({ message: "Tablero no encontrado para actualizar" });
        }

        return res.status(200).json({
            message: "Tablero actualizado exitosamente",
            data: dashboardActualizado
        });
    } catch (error) {
        console.error("Error al actualizar tablero: ", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "El código que intentas asignar ya está siendo utilizado por otro tablero" });
        }
        return res.status(500).json({ message: "Error al actualizar el tablero" });
    }
};

// ==========================================
// 5. ELIMINAR (Borrar)
// ==========================================
export const deleteDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        
        const dashboardEliminado = await Dashboard.findByIdAndDelete(id);

        if (!dashboardEliminado) {
            return res.status(404).json({ message: "Tablero no encontrado para eliminar" });
        }

        return res.status(200).json({
            message: "Tablero eliminado exitosamente",
            data: dashboardEliminado
        });
    } catch (error) {
        console.error("Error al eliminar tablero: ", error);
        return res.status(500).json({ message: "Error interno al intentar eliminar el tablero" });
    }
};

// ==========================================
// 6. ENDPOINT DE RECOMENDACIÓN CON IA
// ==========================================
export const ianAgent = async (req, res) => {
    try {
        const { prompt, chatHistory } = req.body; 
        
        if (!prompt) {
            return res.status(400).json({ message: "El prompt es requerido" });
        }

        // 1. Obtener todas las bases de conocimiento
        const [dbTableros, dbSynonyms, dbRawData] = await Promise.all([
            Dashboard.find().lean(),
            Synonyms.find().lean(),
            RawData.find().lean() // Traemos todo, pero lo filtraremos
        ]);

        // 2. Preparar el contexto optimizado para el LLM
        const catalogoLigero = buildLightweightCatalog(dbTableros, dbRawData);
        const historialFormateado = formatChatHistoryForGemini(chatHistory || []);

        // 3. Consultar a la IA como CEREBRO ÚNICO
        let iaDecision;
        try {
            iaDecision = await consultarGeminiEnServidor(
                prompt, 
                historialFormateado, 
                catalogoLigero, 
                dbSynonyms
            );
            // Log para debug interno (muy útil ver qué pensó la IA)
            console.log("💭 Razón IAN:", iaDecision.analisis_interno);
        } catch (geminiError) {
            console.error("Error crítico en Gemini:", geminiError);
            return res.status(503).json({ 
                respuesta: "En este momento estoy experimentando problemas de conexión con mis servidores cognitivos. Por favor intenta en unos segundos.",
                recomendaciones: []
            });
        }

        // 4. Mapear los IDs seleccionados por la IA con los objetos reales de la BD
        const recomendacionesReales = [];
        const { ids_seleccionados, respuesta_agente } = iaDecision;

        if (ids_seleccionados && ids_seleccionados.length > 0) {
            ids_seleccionados.forEach(id => {
                // Buscar primero en Tableros (por codigo o por _id)
                let recurso = dbTableros.find(t => t.codigo === id || t._id.toString() === id);
                
                // Si no está, buscar en RawData
                if (!recurso) {
                    recurso = dbRawData.find(r => r._id.toString() === id);
                }

                // Validación final de seguridad: Solo devolver si realmente existe en BD
                if (recurso) {
                    recomendacionesReales.push(recurso);
                }
            });
        }

        // 5. Respuesta estandarizada y 100% SINCRONIZADA
        return res.status(200).json({
            respuesta: respuesta_agente,
            recomendaciones: recomendacionesReales
        });

    } catch (error) {
        console.error("Error crítico en el controlador del agente:", error);
        return res.status(500).json({ message: "Error interno al procesar la solicitud." });
    }
};
