import { StreamChat } from "stream-chat";
import { ENV } from "../backend/src/lib/env.js";


export default async function handler(req, res) {
 
  const allowedOrigin = ENV.CLIENT_URL || "*";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  console.log("DEBUG: Connecting to Stream...");
  console.log("DEBUG: API Key exists?", !!ENV.STREAM_API_KEY);
  console.log("DEBUG: Secret exists?", !!ENV.STREAM_API_SECRET);

  const apiKey = ENV.STREAM_API_KEY;
  const apiSecret = ENV.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.error("CRITICAL: Stream Keys are MISSING in Vercel!");
    return res.status(500).json({ error: "Server Keys Missing" });
  }

  try {
    const serverClient = StreamChat.getInstance(apiKey, apiSecret);
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID missing" });

    const token = serverClient.createToken(userId);
    console.log("DEBUG: Token generated successfully");
    
    return res.status(200).json({ token, userId });
  } catch (error) {
    console.error("DEBUG: Crash Error:", error);
    return res.status(500).json({ error: error.message });
  }
}