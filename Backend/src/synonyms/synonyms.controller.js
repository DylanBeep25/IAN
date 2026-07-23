// src/controllers/synonyms.controller.js
import Synonyms from '../synonyms/synonyms.model.js'; // Ajusta la ruta según tu estructura

// ==========================================
// 1. OBTENER TODOS (Listar)
// ==========================================
export const getSynonyms = async (req, res) => {
    try {
        const sinonimos = await Synonyms.find().lean();
        
        return res.status(200).json({
            message: "Sinónimos obtenidos exitosamente",
            data: sinonimos
        });
    } catch (error) {
        console.error("Error al obtener sinónimos desde MongoDB: ", error);
        return res.status(500).json({ message: "Error interno del servidor al procesar sinónimos" });
    }
};

// ==========================================
// 2. OBTENER POR ID (Buscar uno específico)
// ==========================================
export const getSynonymById = async (req, res) => {
    try {
        const { id } = req.params;
        const sinonimo = await Synonyms.findById(id).lean();

        if (!sinonimo) {
            return res.status(404).json({ message: "Sinónimo no encontrado" });
        }

        return res.status(200).json({
            message: "Sinónimo obtenido exitosamente",
            data: sinonimo
        });
    } catch (error) {
        console.error("Error al buscar sinónimo por ID: ", error);
        return res.status(500).json({ message: "Error al buscar el sinónimo. Verifica el ID." });
    }
};

// ==========================================
// 3. AGREGAR (Crear)
// ==========================================
// ==========================================
// 3. AGREGAR (Crear)
// ==========================================
export const addSynonym = async (req, res) => {
    try {
        // AHORA RECIBIMOS TAMBIÉN LOS SINÓNIMOS DESDE EL FRONTEND
        const { termino, significado, sinonimos } = req.body;

        if (!termino || !significado) {
            return res.status(400).json({ message: "Los campos 'termino' y 'significado' son obligatorios" });
        }

        const nuevoSinonimo = await Synonyms.create({
            termino: termino.trim(),
            significado: significado.trim(),
            // Si el frontend no manda sinónimos, guardamos un arreglo vacío
            sinonimos: sinonimos || [] 
        });

        return res.status(201).json({
            message: "Sinónimo creado exitosamente",
            data: nuevoSinonimo
        });
    } catch (error) {
        console.error("Error al crear sinónimo: ", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "El término ingresado ya existe en la base de datos" });
        }
        return res.status(500).json({ message: "Error al crear el sinónimo" });
    }
};

// ==========================================
// 4. EDITAR (Actualizar)
// ==========================================
export const updateSynonym = async (req, res) => {
    try {
        const { id } = req.params;
        const datosAActualizar = req.body;

        const sinonimoActualizado = await Synonyms.findByIdAndUpdate(
            id, 
            datosAActualizar, 
            { new: true, runValidators: true }
        );

        if (!sinonimoActualizado) {
            return res.status(404).json({ message: "Sinónimo no encontrado para actualizar" });
        }

        return res.status(200).json({
            message: "Sinónimo actualizado exitosamente",
            data: sinonimoActualizado
        });
    } catch (error) {
        console.error("Error al actualizar sinónimo: ", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "El término que intentas asignar ya está registrado" });
        }
        return res.status(500).json({ message: "Error al actualizar el sinónimo" });
    }
};

// ==========================================
// 5. ELIMINAR (Borrar)
// ==========================================
export const deleteSynonym = async (req, res) => {
    try {
        const { id } = req.params;
        
        const sinonimoEliminado = await Synonyms.findByIdAndDelete(id);

        if (!sinonimoEliminado) {
            return res.status(404).json({ message: "Sinónimo no encontrado para eliminar" });
        }

        return res.status(200).json({
            message: "Sinónimo eliminado exitosamente",
            data: sinonimoEliminado
        });
    } catch (error) {
        console.error("Error al eliminar sinónimo: ", error);
        return res.status(500).json({ message: "Error interno al intentar eliminar el sinónimo" });
    }
};