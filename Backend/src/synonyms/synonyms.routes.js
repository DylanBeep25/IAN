import { Router } from "express";
import { addSynonym, deleteSynonym, getSynonymById, getSynonyms, updateSynonym } from "./synonyms.controller.js";

const api = Router()

api.get('/synonyms', getSynonyms)//
api.get('/searchSynonyms/:id', getSynonymById)//
api.post('/addSynonyms', addSynonym)//
api.put('/updateSynonyms/:id', updateSynonym)//
api.delete('/deleteSynonyms/:id', deleteSynonym)//

export default api;