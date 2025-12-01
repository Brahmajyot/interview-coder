import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, 
    language: { type: String, required: true }, 
    code: { type: String, required: true }, 
    title: { type: String, default: "Untitled Interview" },
  },
  { timestamps: true }
);

export default mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);