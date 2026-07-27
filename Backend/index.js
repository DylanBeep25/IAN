import { initServer } from "./configs/app.js";
import { config } from "dotenv";
import { connect } from "./configs/mongo.js";

config()
console.log(process.env.URI_MONGO)
const start = async()=>{
    await connect()
    initServer()
}

start()