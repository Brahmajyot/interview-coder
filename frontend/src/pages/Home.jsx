import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Video, Code, Sparkles } from 'lucide-react'; 

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const startMeeting = () => {
    setLoading(true);
    const randomId = uuidv4();
    
    setTimeout(() => {
      navigate(`/meeting/${randomId}`);
    }, 500);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-950 text-white p-6">
      <div className="max-w-3xl text-center space-y-8">
        
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Technical Interviews, <br />
          <span className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Reimagined.
          </span>
        </h1>
        
        <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
          A split-screen environment with <strong>HD Video</strong> and a <strong>Real-time Code Editor</strong>. 
          Everything you need to ace the technical round.
        </p>

     
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-emerald-500/50 transition-all">
                <Video className="w-10 h-10 text-emerald-500 mb-4 mx-auto" />
                <h3 className="font-bold text-lg">HD Video</h3>
                <p className="text-gray-500 text-sm mt-2">Crystal clear video calls powered by Stream.</p>
            </div>
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-emerald-500/50 transition-all">
                <Code className="w-10 h-10 text-cyan-500 mb-4 mx-auto" />
                <h3 className="font-bold text-lg">Code Editor</h3>
                <p className="text-gray-500 text-sm mt-2">Monaco editor with Python & JS support.</p>
            </div>
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-emerald-500/50 transition-all">
                <Sparkles className="w-10 h-10 text-purple-500 mb-4 mx-auto" />
                <h3 className="font-bold text-lg">AI Ready</h3>
                <p className="text-gray-500 text-sm mt-2">Collaborative environment built for speed.</p>
            </div>
        </div>

        <button 
          onClick={startMeeting}
          disabled={loading}
          className={`
            group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 
            bg-emerald-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 
            ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-700 hover:scale-105 shadow-lg shadow-emerald-500/30'}
          `}
        >
          {loading ? 'Creating Room...' : 'Start New Interview'}
          {!loading && (
             <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
             </svg>
          )}
        </button>

      </div>
    </div>
  );
}