import mongoose from "mongoose"


import { ENV } from "./env.js";

export const connectDB = async() => {
    try{
        if (!ENV.DB_URL) {
  throw new Error("DB_URI environment variable is required");
}
        const conn = await mongoose.connect(ENV.DB_URL)
        console.log("sucessfully connected with db",conn.connection.host)
    
    }
    catch(error)
    {
    console.log("connection is not done try again !!" , error)
    process.exit(1)
    }
};