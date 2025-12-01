import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useUser } from '@clerk/clerk-react';


const apiKey = import.meta.env.VITE_STREAM_API_KEY;

export const useStreamClient = () => {
  const { user, isLoaded } = useUser();
  const [client, setClient] = useState(null);

  useEffect(() => {
    
    if (!isLoaded || !user || !apiKey) return;

   
    const chatClient = StreamChat.getInstance(apiKey);

    const connectUser = async () => {
      try {
        
        const response = await fetch(`/api/token`, { 
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.id }),
});

        const { token } = await response.json();

        if (!token) throw new Error("Failed to get token");

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

    
    return () => {
      chatClient.disconnectUser();
      setClient(null);
    };
  }, [user, isLoaded]);

  return client;
};