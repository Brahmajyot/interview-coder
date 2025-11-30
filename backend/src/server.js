import express from "express";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import interviewRoutes from "./routes/interviewRoutes.js"; 

const app = express();

app.use(express.json());
app.use(cors());

// Connect DB 
connectDB(); 

app.get("/", (req, res) => res.send("API is running"));

// ROUTES
app.use("/api/interviews", interviewRoutes); 

export default app;