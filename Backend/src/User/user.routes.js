import { Router } from "express";
import { adminUpdateUser, createUser, deleteUser, getUserProfile, getUsers, updateProfile } from "./user.controller.js";
import { isAdmin, isFullAdmin, validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router()

api.get('/getUsers',[validateJwt, isFullAdmin], getUsers)
api.get('/getUser', [validateJwt], getUserProfile)
api.post('/createUser', [validateJwt, isFullAdmin], createUser)
api.put('/updateProfile', [validateJwt], updateProfile)
api.put('/adminUpdate/:id', [validateJwt, isFullAdmin], adminUpdateUser)
api.delete('/deleteUser/:id', [validateJwt, isFullAdmin], deleteUser)

export default api