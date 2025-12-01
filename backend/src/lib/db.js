import mongoose from "mongoose";

// 👇 CRITICAL CHANGE: We added process.env.DB_URL here
const MONGODB_URI = process.env.MONGODB_URI || process.env.DB_URI || process.env.DB_URL;

if (!MONGODB_URI) {
  throw new Error("❌ Missing MongoDB URI. Checked: MONGODB_URI, DB_URI, and DB_URL.");
}

let isConnected = false;

export const connectDB = async () => {
  // 1. If already connected, reuse it (Performance)
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    // 2. Connect
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "interview-db", // Forces connection to your specific DB
      bufferCommands: false,
    });

    isConnected = true;
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    // 3. Throw error so Inngest/Vercel knows it failed
    throw error;
  }
};