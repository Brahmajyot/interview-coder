import { Inngest } from "inngest";
import { serve } from "inngest/node"; // Use 'node' adapter
import { functions } from "../backend/src/lib/functions.js";

const inngest = new Inngest({ id: "interview_video" });

// Disable body parsing so Inngest receives the raw stream
export const config = {
  api: {
    bodyParser: false,
  },
};

export default serve({
  client: inngest,
  functions: functions,
});