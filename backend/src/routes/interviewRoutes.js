import express from "express";
import { saveInterview, getUserInterviews } from "../controllers/interviewController.js";

const router = express.Router();

router.post("/", saveInterview);
router.get("/:userId", getUserInterviews);

export default router;