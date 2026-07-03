import { Router } from "express";
import { getSynonyms } from "./synonyms.controller.js";

const api = Router()

api.get('/synonyms', getSynonyms)

export default api;