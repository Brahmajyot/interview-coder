import { useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react'; 

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

export const StreamVideoProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [videoClient, setVideoClient] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const initVideo = async () => {
      
      const response = await fetch(`/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const { token } = await response.json();

      if (!token) return;

      // Initialize the Video Client
      const client = new StreamVideoClient({
        apiKey,
        user: {
          id: user.id,
          name: user.fullName || user.id,
          image: user.imageUrl,
        },
        token,
      });

      setVideoClient(client);
    };

    initVideo();
  }, [user, isLoaded]);

  if (!videoClient) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
        <Loader2 className="animate-spin h-8 w-8 text-emerald-500" />
      </div>
    );
  }

  return (
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  );
};