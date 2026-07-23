import { Schema, model } from "mongoose";

// Sub-esquema recursivo (archivos o carpetas)
const nodeSchema = new Schema();
nodeSchema.add({
    name: { type: String, required: true },
    type: { type: String, enum: ['folder', 'file'], required: true },
    extension: { type: String }, 
    url: { type: String }, 
    children: [nodeSchema], // Permite rutas dentro de rutas infinitamente
    tablero: {type: String}
});

// ESQUEMA PRINCIPAL (Ahora es una Carpeta Raíz libre)
const rawDataSchema = new Schema(
    {
        nombreCarpeta: { 
            type: String, 
            required: true, 
            // Ej: "Raw Data El Salvador" o "Mapas Honduras"
        },
        descripcion: { type: String },
        contenido: [nodeSchema] // Aquí metes tu estructura de archivos
    },
    { timestamps: true }
);

export default model('Rawdata', rawDataSchema);