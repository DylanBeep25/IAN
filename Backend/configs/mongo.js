import mongoose from "mongoose";

export const connect = async () => {
    try {
        mongoose.connection.on('error', () => console.log('MongoDB | Error en la conexión'));
        mongoose.connection.on('connecting', () => console.log('MongoDB | Intentando conectar...'));
        mongoose.connection.on('connected', () => console.log('MongoDB | Conectado exitosamente'));
        mongoose.connection.on('open', () => console.log('MongoDB | Conexión abierta'));
        mongoose.connection.on('reconnected', () => console.log('MongoDB | Reconectado'));
        mongoose.connection.on('disconnected', () => console.log('MongoDB | Desconectado'));

        // Lee la variable URI directamente. Si no existe, usa la estructura local por defecto.
        const dbUri = process.env.URI_MONGO || `${process.env.DB_SERVICE}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

        await mongoose.connect(dbUri, {
            maxPoolSize: 50,
            serverSelectionTimeoutMS: 5000
        });
    } catch (error) {
        console.error('Database connection failed', error);
    }
};