import mongoose from "mongoose";
import { ENV } from "./env";

// Try both common variable names
const MONGODB_URL = ENV.DB_URL;

if (!MONGODB_URL) {
  throw new Error("❌ MongoDB URL missing! Add MONGODB_URI to Vercel Env Vars.");
}

let isConnected = false; // Track connection status

export const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URL, {
      dbName: "interview-db", // Ensure this matches your desired DB name
      bufferCommands: false,  // Disable buffering for serverless
    });

    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error; // Crash the function so Inngest knows to retry
  }
};