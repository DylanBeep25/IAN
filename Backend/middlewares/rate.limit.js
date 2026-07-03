import rateLimit from "express-rate-limit";

export const limiter = rateLimit(
    {
        windowMs: 15 * 60 * 1000,
        max: 100,
        message:{
            message:"Demasiadas solicitudes, espera 15 minutos antes de volver a intentarlo"
        }
    }
)