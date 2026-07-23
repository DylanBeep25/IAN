import { Router } from "express";
import { addRawData, deleteRawData, getRawData, getRawDataById, updateRawData } from "./rawdata.controller.js";

const api = Router()

api.get('/rawdata', getRawData)
api.get('/searchRawData/:id', getRawDataById)
api.post('/addRawData', addRawData)
api.put('/updateRawData/:id', updateRawData)
api.delete('/deleteRawData/:id', deleteRawData)

export default api;