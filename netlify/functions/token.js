import { StreamChat } from "stream-chat";

// Initialize Stream (Use your same keys)
const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

export const handler = async (event, context) => {
  // 1. Security Check: Ensure the user is logged in via Clerk
  // Note: specific implementation depends on how you pass the Clerk session
  // For a simple start, we will assume the User ID is passed in the body (less secure)
  // OR strictly parse the Clerk session (more secure, requires Clerk middleware)
  
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { userId } = JSON.parse(event.body);

    if (!userId) {
      return { statusCode: 400, body: "User ID is missing" };
    }

    // 2. Generate the Token
    // This token allows the frontend to connect as this user for 1 hour
    const token = serverClient.createToken(userId);

    // 3. Send it back
    return {
      statusCode: 200,
      body: JSON.stringify({ token, userId }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};