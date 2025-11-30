import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";




const apiKey=ENV.STREAM_API_KEY;
const apiSecret =ENV.STREAM_API_SECRET;
if (!apiKey || !apiSecret) {
  throw new Error("Missing Stream API Keys");
}

export const streamClient = StreamChat.getInstance(apiKey, apiSecret);