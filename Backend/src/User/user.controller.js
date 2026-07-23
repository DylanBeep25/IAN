'use strict'

import User from '../User/user.model.js'
import { encrypt } from '../../utils/encrypt.js'

export const defaultAdmin = async (nameA, surnameA, usernameA, emailA, passwordA, roleA) => {
    try {
        let adminFound = await User.findOne({ role: 'ADMIN' })
        let usernameExists = await User.findOne({ username: usernameA })
        let emailExists = await User.findOne({ email: emailA })

        if (adminFound) {
            return console.log('El administrador predeterminado ya existe.')
        }

        if (usernameExists || emailExists) {
            return console.log('No se puede crear el administrador predeterminado: el nombre de usuario o el correo electrónico ya existen.')
        }

        const data = {
            name: nameA,
            surname: surnameA,
            username: usernameA,
            email: emailA,
            password: await encrypt(passwordA),
            role: roleA
        }

        let user = new User(data)
        await user.save()
        console.log('Se ha creado un administrador predeterminado.')
    } catch (err) {
        console.error('Error al crear el administrador predeterminado:', err)
    }
}


export const getUsers = async(req, res)=>{
    try {
        const users = await User.find().lean()

        return res.status(200).send({
            success:true,
            message: "Usuarios encontrados",
            data: users
        })

    } catch (error) {
        console.error("Error al obtener usuarios: ", error)
        return res.status(500).send(
            {
                message: "Error general al buscar usuarios"
            }
        )
    }
}


export const getUserProfile = async (req, res) => {
    try {
        
        const id = req.user.uid;
        
        const user = await User.findById(id);
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        return res.send({
            success: true,
            message: 'Usuario encontrado',
            user // El frontend lo recibirá como res.user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al encontrar el usuario' });
    }
}


export const createUser = async (req, res) => {
    try {
        const { name, surname, username, email, password, role } = req.body;

        // Encriptar la contraseña antes de guardarla usando tu utilidad
        const encryptedPassword = await encrypt(password);

        const newUser = await User.create({
            name,
            surname,
            username,
            email,
            password: encryptedPassword,
            role: role || 'ADMIN' // Asigna ADMIN por defecto si no se especifica
        });

        return res.status(201).send({
            success: true,
            message: "Usuario creado exitosamente",
            data: newUser
        });
    } catch (error) {
        console.error("Error al crear usuario: ", error);
        // Manejo del error de duplicidad en username o email
        if (error.code === 11000) {
            return res.status(400).send({
                success: false, 
                message: "El nombre de usuario o correo electrónico ya están en uso" 
            });
        }
        return res.status(500).send({
            success: false, 
            message: "Error interno al crear el usuario" 
        });
    }
};

// ==========================================
// 4. Actualizar usuario propio
// ==========================================
export const updateProfile = async (req, res) => {
    try {
        const id = req.user.uid; 
        const { oldPassword, newPassword, name, surname, username, email } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ success: false, message: "Usuario no encontrado" });
        }

        // --- VALIDACIÓN DE DUPLICADOS CONTRA OTROS USUARIOS ---
        if (username) {
            const usernameLower = username.toLowerCase().trim();
            // Buscamos si ALGUIEN MÁS (que NO sea yo) ya tiene ese username
            const existingUsername = await User.findOne({ username: usernameLower, _id: { $ne: id } });
            if (existingUsername) {
                return res.status(400).send({
                    success: false,
                    message: `El nombre de usuario '${username}' ya está en uso por otra persona.`
                });
            }
        }

        if (email) {
            const emailLower = email.toLowerCase().trim();
            // Buscamos si ALGUIEN MÁS (que NO sea yo) ya tiene ese email
            const existingEmail = await User.findOne({ email: emailLower, _id: { $ne: id } });
            if (existingEmail) {
                return res.status(400).send({
                    success: false,
                    message: `El correo '${email}' ya pertenece a otra cuenta.`
                });
            }
        }

        // CONSTRUIMOS EL OBJETO CON LOS DATOS DE ACTUALIZACIÓN
        const dataToUpdate = {};
        if (name) dataToUpdate.name = name.trim();
        if (surname) dataToUpdate.surname = surname.trim();
        if (username) dataToUpdate.username = username.toLowerCase().trim();
        if (email) dataToUpdate.email = email.toLowerCase().trim();

        // LÓGICA DE CONTRASEÑA
        if (newPassword) {
            if (!oldPassword) {
                return res.status(400).send({ 
                    success: false, 
                    message: "Debes ingresar tu contraseña actual para establecer una nueva" 
                });
            }

            const isMatch = await checkPassword(user.password, oldPassword);
            if (!isMatch) {
                return res.status(400).send({ 
                    success: false, 
                    message: "La contraseña actual es incorrecta" 
                });
            }

            dataToUpdate.password = await encrypt(newPassword);
        }

        // ACTUALIZAMOS
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            dataToUpdate, 
            { new: true, runValidators: true }
        );

        return res.status(200).send({
            success: true,
            message: "Perfil actualizado exitosamente",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        if (error.code === 11000) {
            return res.status(400).send({
                success: false, 
                message: "El nombre de usuario o correo electrónico ya están en uso por otro registro" 
            });
        }
        return res.status(500).send({ success: false, message: "Error al actualizar el perfil" });
    }
};

// ==========================================
// 4.2 Actualizar usuarios (FULL ADMIN)
// ==========================================
export const adminUpdateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role){
            return res.status(400).send(
                {
                    success: false,
                    message: "El campo 'role' es obligatorio para esta actualización"
                }
            )
        }

        const updatedUser = await User.findByIdAndUpdate(
            id, 
            {role : role.toUpperCase()},
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ success: false, message: "Usuario no encontrado" });
        }

        return res.status(200).send({
            success: true,
            message: "Rol de usuario actualizado correctamente",
            data: updatedUser
        });
    } catch (error) {
        console.error("Error en adminUpdateUser:", error);
        return res.status(500).send(
            { 
                success: false, message: "Error al actualizar rol de usuario" 
            }
        );
    }
};



// ==========================================
// 5. ELIMINAR USUARIO (Delete)
// ==========================================
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send({
                success: false, 
                message: "Usuario no encontrado para eliminar" 
            });
        }

        return res.status(200).send({
            success: true,
            message: "Usuario eliminado exitosamente",
            data: deletedUser
        });
    } catch (error) {
        console.error("Error al eliminar usuario: ", error);
        return res.status(500).send({
            success: false, 
            message: "Error interno al intentar eliminar el usuario" 
        });
    }
};