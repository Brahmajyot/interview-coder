import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useUser } from '@clerk/clerk-react';

// Use your PUBLIC Key here (It's safe to expose in frontend)
const apiKey = import.meta.env.VITE_STREAM_API_KEY;

export const useStreamClient = () => {
  const { user, isLoaded } = useUser();
  const [client, setClient] = useState(null);

  useEffect(() => {
    // 1. Wait for Clerk to load the user
    if (!isLoaded || !user || !apiKey) return;

    // 2. Initialize the client
    const chatClient = StreamChat.getInstance(apiKey);

    const connectUser = async () => {
      try {
        // 3. Ask your Netlify Function for a token
        const response = await fetch(`/api/token`, { 
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.id }),
});

        const { token } = await response.json();

        if (!token) throw new Error("Failed to get token");

        // 4. Connect the User to Stream
        await chatClient.connectUser(
          {
            id: user.id,
            name: user.fullName || user.firstName,
            image: user.imageUrl,
          },
          token
        );

        setClient(chatClient);
      } catch (error) {
        console.error("Connection Failed", error);
      }
    };

    connectUser();

    // Cleanup when component unmounts or user logs out
    return () => {
      chatClient.disconnectUser();
      setClient(null);
    };
  }, [user, isLoaded]);

  return client;
};