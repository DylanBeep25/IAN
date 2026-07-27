import { Router } from "express";
import { addDashboard, deleteDashboard, getDashboards, getDashboardById, updateDashboard, ianAgent } from "./dashboard.controller.js";


const api = Router()

api.get('/getDashboards', getDashboards)//
api.get('/searchDashboards/:id', getDashboardById)//
api.post('/addDashboard', addDashboard)//
api.put('/updateDashboard/:id', updateDashboard)//
api.delete('/deleteDashboard/:id', deleteDashboard)//
api.post('/ianRecommendation', ianAgent)//

export default api;