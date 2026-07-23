import { initServer } from "./configs/app.js";
import { config } from "dotenv";
import { connect } from "./configs/mongo.js";

config()

const start = async()=>{
    await connect()
    initServer()
}

start()