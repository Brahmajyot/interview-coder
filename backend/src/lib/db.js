import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || process.env.DB_URI || process.env.DB_URL;

if (!MONGODB_URI) {
  throw new Error("❌ Missing MongoDB URI. Checked: MONGODB_URI, DB_URI, and DB_URL.");
}

let isConnected = false;

export const connectDB = async () => {
  
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
   
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "interview-db", 
      bufferCommands: false,
    });

    isConnected = true;
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
   
    throw error;
  }
};