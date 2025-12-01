import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { StreamVideoProvider } from './components/StreamVideoProvider';
import '@stream-io/video-react-sdk/dist/css/styles.css'; 

import Home from './pages/Home';
import MeetingRoom from './pages/MeetingRoom';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-950 text-white font-sans selection:bg-emerald-500/30">
        
       
        <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
          
            <h1 className="text-2xl font-extrabold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
              Interview Coder
            </h1>
          </div>
          
         
          <div>
             <SignedOut>
                <SignInButton 
                  mode="modal" 
                  className="text-gray-300 hover:text-white font-medium transition-colors cursor-pointer" 
                />
             </SignedOut>
             <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: { 
                      avatarBox: "w-10 h-10 border-2 border-emerald-500 hover:scale-105 transition-transform" 
                    }
                  }} 
                />
             </SignedIn>
          </div>
        </header>

        
        <main className="grow flex flex-col">
          <Routes>
            
           
            <Route path="/" element={
              <>
              
                <SignedOut>
                  <div className="grow flex flex-col items-center justify-center text-center px-6 py-12 relative overflow-hidden">
                  
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

                    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 relative z-10">
                      Master Your <br/>
                      <span className="text-emerald-400">Technical Interview</span>
                    </h2>
                    
                    <p className="text-gray-400 text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed relative z-10">
                      The ultimate platform for mock interviews. 
                      Real-time <strong>HD Video</strong> paired with a collaborative <strong>Code Editor</strong>.
                    </p>
                    
                    <div className="relative z-10">
                      <SignInButton mode="modal">
                        <button className="bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105 active:scale-95">
                          Get Started for Free
                        </button>
                      </SignInButton>
                    </div>
                  </div>
                </SignedOut>
                
               
                <SignedIn>
                   <StreamVideoProvider>
                      <Home />
                   </StreamVideoProvider>
                </SignedIn>
              </>
            } />

            
            <Route path="/meeting/:id" element={
              <SignedIn>
                <StreamVideoProvider>
                  <MeetingRoom />
                </StreamVideoProvider>
              </SignedIn>
            } />
            
           
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>

      
        <footer className="py-6 text-center text-gray-600 text-sm border-t border-gray-900 bg-gray-950">
          <p>© {new Date().getFullYear()} Interview Coder. Built with Jyoti Dev ❤️.</p>
        </footer>

      </div>
    </Router>
  );
}

export default App;