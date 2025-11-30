import mongoose from "mongoose"


import { ENV } from "./env.js";

export const connectDB = async() => {
    try{
        const conn = await mongoose.connect(ENV.DB_URL)
        console.log("sucessfully connected with db",conn.connection.host)
    
    }
    catch(error)
    {
    console.log("connection is not done try again !!" , error)
    process.exit(1)
    }
};