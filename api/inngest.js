import { Inngest } from "inngest";
import { serve } from "inngest/node"; // ⚠️ Must use 'node' adapter for Vercel
import { functions } from "../backend/src/lib/functions.js";

const inngest = new Inngest({ id: "interview_video" });

// ⚠️ CRITICAL VERCEL CONFIGURATION
// This tells Vercel: "Don't parse the JSON body. Give Inngest the raw stream."
export const config = {
  api: {
    bodyParser: false,
  },
};

export default serve({
  client: inngest,
  functions: functions,
});