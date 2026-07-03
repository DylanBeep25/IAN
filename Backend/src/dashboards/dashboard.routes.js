import { Router } from "express";
import { dashboardRecomendation, getTableros } from "./dashboard.controller.js";


const api = Router()

api.get('/dashboards', getTableros)
api.post('/recommend', dashboardRecomendation)

export default api;