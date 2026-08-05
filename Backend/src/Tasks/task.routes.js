import { Router } from "express";
import { createTask, deleteTask, exportTasksToExcel, getTasks, getUserTemplates, getWeeklySummary, updateTask } from "./task.controller.js";
import { hasRole, isFullAdmin, validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router()

api.use(validateJwt)

api.get('/tasks', hasRole('ADMIN', 'FULL ADMIN'),getTasks)
api.post('/createTask', hasRole('ADMIN', 'FULL ADMIN'), createTask)
api.put('/updateTask/:id', hasRole('ADMIN', 'FULL ADMIN'),updateTask)
api.delete('/deleteTask/:id', hasRole('ADMIN', 'FULL ADMIN'),deleteTask)

//recommendations
//resumen semanal
api.get('/summary', isFullAdmin, getWeeklySummary)

//recomendacioens
api.get('/templates', hasRole('ADMIN', 'FULL ADMIN'),getUserTemplates)

//exportar a excel
api.get('/toExcel', hasRole('ADMIN', 'FULL ADMIN'), exportTasksToExcel)

export default api