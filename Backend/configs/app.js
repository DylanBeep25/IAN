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

const allowedOrigins = [
    'http://localhost:5174',
    'http://localhost:5173',
    'https://ian-swart-kappa.vercel.app'
]

const configs = (app)=>{
    app.use(express.json())
    app.use(express.urlencoded({extended:false}))
    app.use(cors({
        origin: allowedOrigins,
        credentials: true
    }))
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(limiter)
}

const routes = (app) =>{
    app.use(dashboardRoutes)
    app.use(synonymsRoutes)
    app.use(rawdataRoutes)
}

export const initServer = () =>{
    const app = express()
    try {
        configs(app)
        routes(app)

        const server = http.createServer(app)

        const io = new Server(server, {
            cors:{
                origin: 'http://localhost:5174',
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
    } catch (error) {
        console.error('Server init failed', error)
    }
}