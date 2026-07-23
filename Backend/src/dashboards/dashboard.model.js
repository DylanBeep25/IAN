import { Schema, model } from "mongoose";

const dashboardSchema = Schema(
    {
        codigo:{
            type: String,
            required: true,
            unique: true
        },
        nombre:{
            type: String,
            required: true
        },
        pais:{
            type: String
        },
        area:{
            type: String
        },
        descripcion:{
            type: String
        },
        url:{
            type: String,
            required: true,
        },
        responsable:{
            type: String
        },
        frecuencia:{
            type: String
        },
        preguntas:[
            {
                type:String
            }
        ],
        cuandoUsar:[
            {
                type:String
            }
        ],
        cuandoNoUsar:[
            {
                type:String
            }
        ],
        keywords:[
            {
                type:String
            }
        ],
        kpis:[
            {
                name: {
                    type: String, 
                    required: true
                },
                definition: {
                    type: String
                }
            }
        ],
        resumenIA:{
            type: String
        },
        destino:{
            type: String
        },
        actualizacion:{
            type: String
        }
    },
    {
        timestamps: true
    }
)

export default model('Dashboard', dashboardSchema)