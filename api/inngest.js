import { Inngest } from "inngest";
import { serve } from "inngest/lambda";
import { functions } from "../backend/src/lib/functions.js";

// 1. Initialize logic outside the handler
const inngest = new Inngest({ id: "interview_video" });

// 2. Create the Inngest handler but DO NOT export it directly yet
const inngestHandler = serve({
  client: inngest,
  functions: functions,
});

// 3. Keep the Vercel config
export const config = {
  api: {
    bodyParser: false,
  },
};

// 4. Export a wrapper function with Try/Catch
export default async function (event, context) {
  try {
    // Attempt to run the Inngest handler
    return await inngestHandler(event, context);
  } catch (error) {
    console.error("CRITICAL INNGEST CRASH:", error);
    
    // 5. Force exit as requested
    process.exit(1);
  }
}