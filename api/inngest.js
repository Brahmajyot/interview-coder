import { Inngest } from "inngest";
import { serve } from "inngest/node"; 
import { functions } from "../backend/src/lib/functions.js";

const inngest = new Inngest({ id: "interview_video" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default serve({
  client: inngest,
  functions: functions,
});