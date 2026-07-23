'use strict'

import jwt from 'jsonwebtoken'
import {findUser} from '../utils/db.validators.js'

// Middleware para validar el JWT
export const validateJwt = async(req, res, next) => {
    try {
        let secretKey = process.env.SECRET_KEY
        let { authorization } = req.headers
        
        if (!authorization) return res.status(401).send({ message: 'No estás autorizado, permisos de administador necesario' })
        
        let token = authorization.replace(/^Bearer\s+/, "")

        let user = jwt.verify(token, secretKey)

        const validateUser = await findUser(user.uid)
        
        if (!validateUser) return res.status(404).send({
            success: false,
            message: 'Usuario no encontrado - No autorizado'
        })
        
        req.user = user
        next()
    } catch (err) {
        console.error(err)
        return res.status(401).send({ message: 'Credenciales inválidas' })
    }
}

// Middleware para verificar si el usuario es administrador
export const isFullAdmin = async(req, res, next) => {
    try {
        const { user } = req
        if (!user || user.role !== 'FULL ADMIN') return res.status(403).send({
            success: false,
            message: 'Necesitas permisos de administrador completo para realizar está acción'
        })
        next()
    } catch (err) {
        console.error(err)
        return res.status(403).send({
            success: false,
            message: 'Error con la autorización'
        })
    }
}

// Middleware para verificar si el usuario es cliente
export const isAdmin = async(req, res, next) => {
    try {
        let { role, name } = req.user
        console.log(role, name)
        if (!role || role !== 'ADMIN') return res.status(403).send({
            success: false,
            message: `No tienes acceso | Adaptado solo para administradores: ${name}`
        })
        next()
    } catch (err) {
        console.error(err)
        return res.status(401).send({ message: 'Rol no autorizado' })
    }
}


// Verifica que sea Usuario o Admin
export const hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).send({
          success: false,
          message: `No tienes acceso - Rol requerido: ${allowedRoles.join(' o ')}`
        })
      }
      next()
    } catch (err) {
      console.error(err)
      return res.status(403).send({
        success: false,
        message: 'Error con la autorización'
      })
    }
  }
}