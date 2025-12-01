import { StreamChat } from "stream-chat";
import { ENV } from "../backend/src/lib/env.js";   

export default async function handler(req, res) {
 
  const allowedOrigin = ENV.CLIENT_URL || "*";
  
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");


  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  //  Initialize Stream
  const apiKey = ENV.STREAM_API_KEY;
  const apiSecret = ENV.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: "Server missing Stream API Keys" });
  }

  const serverClient = StreamChat.getInstance(apiKey, apiSecret);

  try {
    // 4. Parse Body
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    // 5. Generate Token
    const token = serverClient.createToken(userId);

    // 6. Return Success
    return res.status(200).json({ token, userId });

  } catch (error) {
    console.error("Token Generation Error:", error);
    return res.status(500).json({ error: error.message });
  }
}