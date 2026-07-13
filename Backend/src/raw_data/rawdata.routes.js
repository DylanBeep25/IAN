import { Router } from "express";
import { getRowData } from "./rawdata.controller.js";

const api = Router()

api.get('/rawdata', getRowData)

export default api;