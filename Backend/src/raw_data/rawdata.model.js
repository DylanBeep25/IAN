import { Schema, model } from "mongoose";

const nodeSchema = new Schema();
nodeSchema.add({
    name: { type: String, required: true },
    type: { type: String, enum: ['folder', 'file'], required: true },
    extension: { type: String }, 
    url: { type: String }, 
    children: [nodeSchema],
    tablero: {type: String}
});

const rawDataSchema = new Schema(
    {
        nombreCarpeta: { 
            type: String, 
            required: true, 
        },
        descripcion: { type: String },
        resumenIA: {type: String},
        contenido: [nodeSchema]
    },
    { timestamps: true }
);

export default model('Rawdata', rawDataSchema);