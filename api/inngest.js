import { Inngest } from "inngest";
import { serve } from "inngest/node"; // ⚠️ Must use 'node', not 'netlify' or 'lambda'
import { functions } from "../backend/src/lib/functions.js";

const inngest = new Inngest({ id: "interview_video" });

// ✅ CRITICAL FOR VERCEL
// This disables Vercel's default body parsing so Inngest can read the event stream
export const config = {
  api: {
    bodyParser: false,
  },
};

export default serve({
  client: inngest,
  functions: functions,
});