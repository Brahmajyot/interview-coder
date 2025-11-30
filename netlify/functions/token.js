import { StreamChat } from "stream-chat";

// Initialize Stream
const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

export const handler = async (event, context) => {
  // 1. Only allow POST
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }

  try {
    // 2. Parse Body
    if (!event.body) {
       return { 
         statusCode: 400, 
         body: JSON.stringify({ error: "Missing request body" }) 
       };
    }

    const { userId } = JSON.parse(event.body);

    if (!userId) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "User ID is missing" }) 
      };
    }

    // 3. Generate Token
    const token = serverClient.createToken(userId);

    // 4. Success Response
    return {
      statusCode: 200,
      body: JSON.stringify({ token, userId }),
    };

  } catch (error) {
    console.error("Token Error:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};