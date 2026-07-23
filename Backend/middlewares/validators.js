import { body } from "express-validator";
import { param } from "express-validator";
import { existEmail, existUsername } from "../utils/db.validators.js";


export const registerValidator = [
    body('name', 'El nombre no puede estar vacío')
        .notEmpty(),
    body('surname', 'El apellido no puede estar vacío')
        .notEmpty(),
    body('email', 'El correo electrónico no puede estar vacío')
        .notEmpty()
        .isEmail()
        .withMessage('El correo electrónico no es válido')
        .custom(existEmail),
    body('username', 'El nombre de usuario no puede estar vacío')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'La contraseña no puede estar vacía')
        .notEmpty()
        .isStrongPassword()
        .withMessage('La contraseña debe ser más fuerte, debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('rol', 'El rol no puede estar vacío')
        .optional()
]