import { serve } from "inngest/netlify";
import { Inngest } from "inngest";
import { functions } from "../../backend/src/lib/functions"; 

export const handler = serve({
  client: Inngest,
  functions: functions,
});