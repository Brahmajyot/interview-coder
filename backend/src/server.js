import express from "express";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import interviewRoutes from "./routes/interviewRoutes.js";

const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || "*", 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
}));

app.use(express.json());

// Connect to Database
connectDB(); 

// Routes
app.get("/", (req, res) => res.send("API is running"));
app.use("/api/interviews", interviewRoutes);


export default app;