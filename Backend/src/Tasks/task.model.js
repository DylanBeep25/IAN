import { Schema, model } from "mongoose";

const taskSchema = new Schema(
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required']
        },
        type: {
            type: String,
            enum: ['PROJECT', 'DAILY_TASK'],
            required: [true, 'Type is required']
        },
        // Nombre del proyecto (obligatorio solo si type === 'PROJECT')
        projectName: {
            type: String,
            trim: true,
            required: function() { return this.type === 'PROJECT'; }
        },
        title: {
            type: String,
            required: [true, 'Title/Description is required'],
            trim: true,
            maxLength: [200, 'Title cannot exceed 200 characters']
        },
        status: {
            type: String,
            enum: ['IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'DONE_TODAY'],
            default: 'IN_PROGRESS'
        },
        // El porcentaje aplica a Proyectos; en Tareas Diarias puede ser opcional
        progressPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        timespend:{
            type: Number,
            min: 0,
            default: 0
        },
        dueDate: {
            type: Date
        },
        comments: {
            type: String,
            default: ''
        },
        isTemplate:{
            type: Boolean,
            default: false
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model ('Task', taskSchema)