import { Inngest } from "inngest";
import { serve } from "inngest/node"; // Correct adapter
import { functions } from "../backend/src/lib/functions.js";

const inngest = new Inngest({ id: "interview_video" });

// ✅ THIS IS THE MOST IMPORTANT PART FOR VERCEL
export const config = {
  api: {
    bodyParser: false, // Disables Vercel's auto-parsing so Inngest receives the stream
  },
};

export default serve({
  client: inngest,
  functions: functions,
});