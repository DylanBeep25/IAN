import { Schema, model } from "mongoose";

const dashboardSchema = Schema(
    {
        termino:{
            type: String,
            required: true,
            unique: true
        },
        significado:{
            type: String,
            required: true
        },
        sinonimos:[{
            type: String
        }]
    }
)

export default model('Synonyms', dashboardSchema)