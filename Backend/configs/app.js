import express from "express";
import morgan from "morgan"
import helmet from "helmet";
import cors from "cors"
import path from "path";
import http from "http"

import { Server } from "socket.io";
import { Socket } from "dgram";
import { limiter } from "../middlewares/rate.limit.js";

import dashboardRoutes from '../src/dashboards/dashboard.routes.js'
import synonymsRoutes from '../src/synonyms/synonyms.routes.js'
import rawdataRoutes from '../src/raw_data/rawdata.routes.js'
import userRoutes from '../src/User/user.routes.js'
import authRoutes from '../src/auth/auth.routes.js'
import taskRoutes from "../src/Tasks/task.routes.js"
import { defaultAdmin } from "../src/User/user.controller.js";

const allowedOrigins = [
    'http://localhost:5174',
    'http://localhost:5173',
    'https://ian-git-main-dylans-projects-0757b7ba.vercel.app',
    'https://ian-swart-kappa.vercel.app'
]

const configs = (app)=>{
    app.use(express.json())
    app.use(express.urlencoded({extended:false}))
    app.use(cors({
        origin: allowedOrigins,
        credentials: true
    }))
    app.use(helmet({
        crossOriginResourcePolicy: {policy: "cross-origin"}
    }))
    app.use(morgan('dev'))
    app.use(limiter)
}

const routes = (app) =>{
    app.use(dashboardRoutes)
    app.use(synonymsRoutes)
    app.use(rawdataRoutes)
    app.use('/auth',authRoutes)
    app.use('/user',userRoutes)
    app.use('/user', taskRoutes)
}

export const initServer = () =>{
    const app = express()
    try {
        configs(app)
        routes(app)

        const server = http.createServer(app)

        const io = new Server(server, {
            cors:{
                origin: allowedOrigins,
                //origin: 'https://ian-swart-kappa.vercel.app',
                credentials: true
            }
        })

        io.on('connection', (socket) =>{
            console.log('Socket conectados: ', socket.id)

            socket.on('disconnect', socket=>{
                console.log('Socket desconectados: ', socket.id)
            })
        })

        app.set('io', io)

        server.listen(process.env.PORT || 3200)
        console.log(`Server running on port: ${process.env.PORT || 3200}`)

        defaultAdmin('Dylan', 'Julian', '1dylan', 'dilanchino10@gmail.com', '123123Aa!', 'FULL ADMIN')
    } catch (error) {
        console.error('Server init failed', error)
    }
}