import User from '../User/user.model.js'
import { check } from 'express-validator'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

export const register = async(req, res)=>{
    try {
        let data = req.body
        let user = new User(data)
        user.password = await encrypt(user.password)
        user.role = 'ADMIN'
        await user.save()

        //Emitir evento socket
        const io = req.app.get('io');
        io.emit('newUser', user);


        return res.send(
            {
                message:`Registro satisfactorio, ya puedes iniciar sesión: ${user.name}`,
                registeredUser: user
            }
        )
    } catch (error) {
        return res.status(500).send({messsage:'Error general al registrarse', error})
    }
}

export const login = async(req,res)=>{
    try {
        let {userLoggin, password} = req.body

        let user = await User.findOne(
            {
                $or:[
                    {email: userLoggin},
                    {username : userLoggin}
                ]
            }
        )

        if(user && await checkPassword(user.password, password)){
            let loggedUser = { 
                uid: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                username: user.username,
                role: user.role
            }

            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Bienvenido ${user.name}`,
                    loggedUser,
                    token
                }
            )

        }
        return res.status(400).send({message:'Credenciales inválidas'})
    } catch (error) {
        return res.status(500).send({message:'Error general con la función Login', error})
    }
}