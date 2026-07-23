import RawData from '../raw_data/rawdata.model.js';

// ==========================================
// 1. OBTENER TODOS
// ==========================================
export const getRawData = async (req, res) => {
    try {
        // Cambiamos el sort. Ahora los ordenamos por fecha de creación (el más nuevo primero)
        const rawData = await RawData.find().sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            message: "Estructuras de raw data obtenidas exitosamente",
            data: rawData
        });
    } catch (error) {
        console.error("Error al obtener raw data desde MongoDB: ", error);
        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

// ==========================================
// 2. OBTENER POR ID 
// ==========================================
export const getRawDataById = async (req, res) => {
    try {
        const { id } = req.params;
        const rawData = await RawData.findById(id).lean();
        
        if (!rawData) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        return res.status(200).json({
            message: "Registro obtenido exitosamente",
            data: rawData
        });
    } catch (error) {
        console.error("Error al buscar por ID: ", error);
        return res.status(500).json({ message: "Error al buscar el registro, verifica que el ID sea válido" });
    }
};

// ==========================================
// 3. AGREGAR (Crear una nueva carpeta raíz)
// ==========================================
export const addRawData = async (req, res) => {
    try {
        // AHORA RECIBIMOS 'nombreCarpeta' en lugar de 'periodo'
        const { nombreCarpeta, descripcion, contenido } = req.body;

        // Validación
        if (!nombreCarpeta) {
            return res.status(400).json({ message: "El campo 'nombreCarpeta' es obligatorio" });
        }

        const nuevoRegistro = await RawData.create({
            nombreCarpeta,
            descripcion: descripcion || '',
            contenido: contenido || [] 
        });

        return res.status(201).json({
            message: "Carpeta raíz creada exitosamente",
            data: nuevoRegistro
        });
    } catch (error) {
        console.error("Error al crear registro: ", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: `Ya existe una carpeta raíz con el nombre '${req.body.nombreCarpeta}'` });
        }
        return res.status(500).json({ message: "Error al crear el registro" });
    }
};

// ==========================================
// 4. EDITAR (Actualizar el árbol)
// ==========================================
export const updateRawData = async (req, res) => {
    try {
        const { id } = req.params;
        const datosAActualizar = req.body;

        const registroActualizado = await RawData.findByIdAndUpdate(
            id, 
            datosAActualizar, 
            { new: true, runValidators: true } 
        );

        if (!registroActualizado) {
            return res.status(404).json({ message: "Registro no encontrado para actualizar" });
        }

        return res.status(200).json({
            message: "Estructura de archivos actualizada exitosamente",
            data: registroActualizado
        });
    } catch (error) {
        console.error("Error al actualizar: ", error);
        if (error.code === 11000) {
            // Actualizamos el mensaje de error de duplicidad
            return res.status(400).json({ message: "El nombre de la carpeta que intentas poner ya está en uso" });
        }
        return res.status(500).json({ message: "Error al actualizar el registro" });
    }
};

// ==========================================
// 5. ELIMINAR 
// ==========================================
export const deleteRawData = async (req, res) => {
    try {
        const { id } = req.params;

        const registroEliminado = await RawData.findByIdAndDelete(id);

        if (!registroEliminado) {
            return res.status(404).json({ message: "Registro no encontrado para eliminar" });
        }

        return res.status(200).json({
            message: "Estructura eliminada exitosamente",
            data: registroEliminado 
        });
    } catch (error) {
        console.error("Error al eliminar: ", error);
        return res.status(500).json({ message: "Error al eliminar el registro" });
    }
};