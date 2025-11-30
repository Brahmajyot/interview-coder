import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Clerk ID 
    language: { type: String, required: true }, // 'javascript' or 'python'
    code: { type: String, required: true }, // The actual code
    title: { type: String, default: "Untitled Interview" },
  },
  { timestamps: true }
);

export default mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);