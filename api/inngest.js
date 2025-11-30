import { Inngest } from "inngest";
// 1. CHANGE THIS LINE: Use 'lambda' instead of 'node'
import { serve } from "inngest/lambda"; 
import { functions } from "../backend/src/lib/functions.js";

const inngest = new Inngest({ id: "interview_video" });

// 2. Keep the config to disable parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default serve({
  client: inngest,
  functions: functions,
});