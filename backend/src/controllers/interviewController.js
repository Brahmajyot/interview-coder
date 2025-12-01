import Interview from "../models/Interview.js";

export const saveInterview = async (req, res) => {
  try {
    const { userId, language, code, title } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newInterview = await Interview.create({
      userId,
      language,
      code,
      title: title || `Interview on ${new Date().toLocaleDateString()}`,
    });

    res.status(201).json(newInterview);
  } catch (error) {
    console.error("Error saving interview:", error);
    res.status(500).json({ error: "Failed to save interview" });
  }
};


export const getUserInterviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch interviews" });
  }
};