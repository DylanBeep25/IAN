/* ---------------------VALIDACIÓN DE CORREO--------------------- */
export const validateEmail = (email) => {
    // Regex para validar un correo electrónico con un formato adecuado.
    const regex = /\S+@\S+\.\S+/
    return regex.test(email)
}

/* ---------------------VALIDACIÓN DE NOMBRE--------------------- */
export const validateName = (name) => {
    // El nombre debe tener entre 1 y 25 caracteres.
    const regex = /^.{1,25}$/
    return regex.test(name)
}

/* ---------------------VALIDACIÓN DE APELLIDO--------------------- */
export const validateSurname = (surname) => {
    // El apellido debe tener entre 1 y 25 caracteres.
    const regex = /^.{1,25}$/
    return regex.test(surname)
}

/* ---------------------VALIDACIÓN DE USUARIO--------------------- */
export const validateUsername = (username) => {
    // El nombre de usuario debe tener entre 3 y 15 caracteres, y no puede contener espacios.
    const regex = /^\S{3,15}$/
    return regex.test(username)
}

/* ---------------------VALIDACIÓN DE CONTRASEÑA--------------------- */
export const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])\S{8,20}$/;
  return regex.test(password);
};


/* ---------------------VALIDACIÓN DE CONFIRMACIÓN DE CONTRASEÑA--------------------- */
export const validatePassConfirm = (password, passConfirm) => {
    // La contraseña de confirmación debe coincidir con la contraseña original.
    return password === passConfirm
}

/* ---------------------VALIDACIÓN DE TELÉFONO--------------------- */
export const validatePhone = (phone) => {
    // El teléfono debe tener entre 8 y 15 caracteres (solo números permitidos).
    const regex = /^[0-9]{8,8}$/
    return regex.test(phone)
}

/* ---------------------MENSAJES DE VALIDACIÓN--------------------- */
export const emailValidationMessage = 'Por favor ingresa un correo válido'
export const usernameValidationMessage = 'El nombre de usuario debe de contener entre 3 a 15 caracteres y no puede contener espacios'
export const passwordValidationMessage = 'La contraseña debe ser más fuerte, debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos'
export const passConfirmValidationMessage = 'Las contraseñas no coinciden'
export const nameValidationMessage = 'El nombre debe contener entre 1 y 25 caracteres'
export const surnameValidationMessage = 'El apellido debe contener entre 1 y 25 caracteres'
export const phoneValidationMessage = 'El teléfono debe tener entre 8 y 15 dígitos'