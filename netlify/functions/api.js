import serverless from "serverless-http";
import app from "../../backend/src/server"; 

// This wraps your entire Express app into a single Netlify Function
export const handler = serverless(app);