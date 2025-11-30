import { Inngest } from "inngest";

import { serve } from "inngest/lambda"; 
import { functions } from "../../backend/src/lib/functions";

const inngest = new Inngest({ id: "interview_video" });

export const handler = serve({
  client: inngest,
  functions: functions,
});