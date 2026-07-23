import { Router } from "express";
import { registerValidator } from "../../middlewares/validators.js";
import { login, register } from "./auth.controller.js";

const api = Router()

api.post(
    '/register', [registerValidator], register
)

api.post('/login', login)

export default api