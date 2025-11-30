import React from 'react';
import { useStreamClient } from './hooks/useStreamClient';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function App() {
  const client = useStreamClient(); // <--- Use our new hook

  return (
    <div style={{ padding: '20px' }}>
      <h1>Interview Coder</h1>
      
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <div style={{ marginTop: '20px' }}>
        <SignedIn>
          {client ? (
            <h2 style={{ color: 'green' }}>✅ Stream Connected!</h2>
          ) : (
            <h2 style={{ color: 'orange' }}>⏳ Connecting to Stream...</h2>
          )}
        </SignedIn>
      </div>
    </div>
  );
}

export default App;