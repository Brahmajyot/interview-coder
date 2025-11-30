import { serve } from "inngest/netlify";


import { inngest, functions } from "../../backend/src/lib/functions"; 

export const handler = serve({
  client: inngest,
  functions: functions,
});