import { Router } from "express";
import { addDashboard, dashboardRecomendation, deleteDashboard, getDashboards, getDashboardById, updateDashboard } from "./dashboard.controller.js";


const api = Router()

api.get('/getDashboards', getDashboards)//
api.get('/searchDashboards/:id', getDashboardById)//
api.post('/addDashboard', addDashboard)//
api.put('/updateDashboard/:id', updateDashboard)//
api.delete('/deleteDashboard/:id', deleteDashboard)//
api.post('/dashboardRecommendation', dashboardRecomendation)//

export default api;