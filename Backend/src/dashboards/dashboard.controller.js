// src/tableros/tablero.controller.js
import { getLocalRecommendations } from '../../utils/searchEngine.js';
import { formatMarkdownText } from '../../utils/helpers.js';
import { consultarGeminiEnServidor } from '../../utils/geminiClient.js';
import Dashboard from './dashboard.model.js';
import Synonyms from '../synonyms/synonyms.model.js'

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
// 6. ENDPOINT DE RECOMENDACIÓN CON IA (Mantenemos el tuyo)
// ==========================================
export const dashboardRecomendation = async (req, res) => {
    try {
        const { prompt } = req.body; 
        if (!prompt) return res.status(400).json({ message: "El prompt es requerido" });

        const [tablerosProcesados, sinonimosProcesados] = await Promise.all([
            Dashboard.find().lean(),
            Synonyms.find().lean()
        ])

        const tarjetasRecomendadas = getLocalRecommendations(prompt, tablerosProcesados, sinonimosProcesados);

        let respuestaIA = "";

        try {
            respuestaIA = await consultarGeminiEnServidor(prompt, tablerosProcesados, sinonimosProcesados);
        } catch (geminiError) {
            console.error("Fallback algorítmico activado:", geminiError);
            if (tarjetasRecomendadas.length === 0) {
                respuestaIA = "Como tu asistente estoy preparado para indicarte tableros, perdona si no tengo una respuesta para eso.";
            } else {
                const principal = tarjetasRecomendadas[0];
                respuestaIA = `*(Sugerencia generada por motor de respaldo)* He ubicado el directorio analítico ideal para tu consulta. Te recomiendo revisar el tablero **${principal.nombre}**.`;
            }
        }

        return res.status(200).json({
            message: respuestaIA, 
            data: tarjetasRecomendadas 
        });

    } catch (error) {
        console.error("Error crítico en el motor de recomendaciones:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};