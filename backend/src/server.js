import express from "express";
import cors from "cors";
import { connectDB } from "./lib/db.js";
// import bookRoutes from "./routes/books"; // Your other routers

const app = express();

app.use(express.json());
app.use(cors());

// REMOVE THIS LINE: app.use("/api/inngest", serve(...)) 
// Why? Because netlify/functions/inngest.js is already handling this!

app.get("/", (req, res) => res.send("API is running"));
// app.use("/api/books", bookRoutes); // Keep your other routes

export default app; // Export for serverless-http