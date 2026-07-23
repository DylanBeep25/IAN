import { isValidObjectId } from "mongoose"
import User from '../src/User/user.model.js'

// Validar existencia de un nombre de usuario (debe ser único para cada usuario)
export const existUsername = async (username, user) => {
  const alreadyUsername = await User.findOne({ username })
  if (alreadyUsername && alreadyUsername._id != user.uid) {
    console.error(`El nombre de usuario ${username} ya existe`)
    throw new Error(`El nombre de usuario ${username} ya existe`)
  }
}

// Validar existencia de un email (debe ser único para cada usuario)
export const existEmail = async (email, user) => {
  const alreadyEmail = await User.findOne({ email })
  if (alreadyEmail && alreadyEmail._id != user.uid) {
    console.error(`El correo electrónico ${email} ya existe`)
    throw new Error(`El correo electrónico ${email} ya existe`)
  }
}

// Validar que el ID de un usuario exista
export const findUser = async (id) => {
  try {
    const userExist = await User.findById(id)
    if (!userExist) return false
    return userExist
  } catch (err) {
    console.error(err)
    return false
  }
}