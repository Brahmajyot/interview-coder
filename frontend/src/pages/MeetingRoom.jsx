import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useStreamVideoClient,
  StreamTheme,
  StreamCall,
} from "@stream-io/video-react-sdk";
import Editor from "@monaco-editor/react";
import { executeCode, CODE_SNIPPETS } from "../api/codeExecution";
import { Loader2, Play, Terminal, Code2, Save, MonitorUp, Lock, Unlock, Volume2, StopCircle } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import CryptoJS from "crypto-js";

export default function MeetingRoom() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(CODE_SNIPPETS["javascript"]);
  const [output, setOutput] = useState("// Output will appear here...");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Security & Audio
  const [encryptionKey, setEncryptionKey] = useState(""); 
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const client = useStreamVideoClient();
  const [call, setCall] = useState(null);
  
  // --- SYNC REFS ---
  const isRemoteUpdate = useRef(false);
  const debounceRef = useRef(null); // 👈 NEW: For throttling updates

  // 1. Join Call
  useEffect(() => {
    if (!client || !user) return;
    const myCall = client.call("default", id);
    myCall.join({ create: true }).then(() => setCall(myCall));
    return () => {
      myCall.leave();
      setCall(null);
    };
  }, [client, id, user]);

  // Helpers
  const encrypt = (text) => {
    if (!encryptionKey) return text;
    return CryptoJS.AES.encrypt(text, encryptionKey).toString();
  };

  const decrypt = (cipherText) => {
    if (!encryptionKey) return cipherText;
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8) || "// 🔒 WRONG KEY";
    } catch (e) {
      return "// 🔒 ENCRYPTED CONTENT";
    }
  };

  // 2. LISTEN FOR UPDATES (Receiver)
  useEffect(() => {
    if (!call) return;

    const unsubscribe = call.on("custom", (event) => {
      if (event.type === "code_update") {
        const incomingCode = event.custom.code;
        const newLang = event.custom.language;
        
        // Decrypt
        const decryptedCode = encryptionKey ? decrypt(incomingCode) : incomingCode;

        if (decryptedCode !== code) {
          // 🛑 Flag this as a remote update so we don't send it back!
          isRemoteUpdate.current = true; 
          setCode(decryptedCode);
          if (newLang) setLanguage(newLang);
        }
      }
    });

    return () => unsubscribe();
  }, [call, encryptionKey]); // Removing 'code' dependency prevents double-firing

  // 3. BROADCAST CHANGES (Sender)
  const handleCodeChange = (value) => {
    setCode(value); // Always update local screen immediately

    // If this change came from the other user, DO NOT send it back
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false; // Reset flag
      return;
    }

    // ⏳ DEBOUNCE: Wait 500ms before sending to network
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(() => {
      if (call) {
        const payload = encryptionKey ? encrypt(value) : value;
        console.log("Sending update..."); // Debug Log
        
        call.sendCustomEvent({
          type: "code_update",
          custom: {
            code: payload,
            language: language
          },
        });
      }
    }, 500); // 500ms delay
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    const newCode = CODE_SNIPPETS[newLang];
    setCode(newCode);
    
    if (call) {
      call.sendCustomEvent({
        type: "code_update",
        custom: { code: encryptionKey ? encrypt(newCode) : newCode, language: newLang },
      });
    }
  };

  // ... (Text to Speech, Run Code, Save Interview - same as before) ...
  const speakCode = () => {
    if (!('speechSynthesis' in window)) return alert("Browser not supported");
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(code);
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const runCode = async () => {
    setIsLoading(true);
    try {
      const result = await executeCode(language, code);
      setOutput(result.run.output || result.message || "Success");
    } catch (error) { setOutput("Error: " + error.message); } 
    finally { setIsLoading(false); }
  };

  const saveInterview = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, language, code, title: "Interview Save" }),
      });
      alert("✅ Saved!");
    } catch (e) { alert("Error saving"); }
    finally { setIsSaving(false); }
  };

  if (!call) return <div className="h-screen flex items-center justify-center bg-gray-950 text-white"><Loader2 className="animate-spin" /></div>;

  return (
    <StreamTheme>
      <StreamCall call={call}>
        <div className="h-screen w-full bg-gray-950 flex flex-col md:flex-row overflow-hidden">
          
          {/* VIDEO PANEL */}
          <div className="flex-1 flex flex-col relative border-r border-gray-800 min-h-[300px] md:min-h-auto">
              <div className="flex-1 bg-gray-900 relative">
                  <SpeakerLayout participantsBarPosition="bottom" />
              </div>
              <div className="bg-gray-950 p-4 flex items-center justify-center gap-4 border-t border-gray-800">
                  <CallControls onLeave={() => navigate('/')} />
                  <button onClick={() => call.screenShare.toggle()} className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white" title="Screen Share">
                    <MonitorUp className="h-5 w-5" />
                  </button>
              </div>
          </div>

          {/* EDITOR PANEL */}
          <div className="flex-1 flex flex-col bg-gray-900 h-full">
            <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 md:px-6 shadow-md">
              <div className="flex items-center gap-3">
                  <Code2 className="h-5 w-5 text-emerald-500" />
                  <select value={language} onChange={handleLanguageChange} className="bg-gray-700 text-white text-sm px-3 py-1.5 rounded-md border border-gray-600">
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                  </select>
              </div>

              <div className="flex gap-2 items-center">
                {showKeyInput && <input type="password" placeholder="Secret Key" value={encryptionKey} onChange={(e) => setEncryptionKey(e.target.value)} className="bg-gray-900 text-white text-xs px-2 py-2 rounded border border-emerald-500/50 w-24" />}
                
                <button onClick={() => setShowKeyInput(!showKeyInput)} className={`p-2 rounded-lg transition-all ${encryptionKey ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-700 text-gray-400"}`}>
                  {encryptionKey ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </button>

                <button onClick={isSpeaking ? () => { window.speechSynthesis.cancel(); setIsSpeaking(false); } : speakCode} className={`p-2 rounded-lg transition-all ${isSpeaking ? "bg-red-500/20 text-red-400" : "bg-gray-700 text-gray-400"}`}>
                  {isSpeaking ? <StopCircle className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>

                <button onClick={saveInterview} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-gray-700 hover:bg-gray-600 text-white border border-gray-600">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span className="hidden sm:inline">Save</span>
                </button>

                <button onClick={runCode} disabled={isLoading} className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-emerald-500/20">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                  <span className="hidden sm:inline">Run</span>
                </button>
              </div>
            </div>

            <div className="grow relative">
              <Editor
                height="100%"
                theme="vs-dark"
                language={language}
                value={code}
                onChange={handleCodeChange}
                options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true, padding: { top: 16 } }}
              />
            </div>

            <div className="h-1/3 min-h-[150px] bg-black border-t border-gray-800 flex flex-col">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800">
                  <Terminal className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-mono text-gray-400 uppercase">Console</span>
              </div>
              <div className="flex-1 p-4 overflow-auto font-mono text-sm">
                  <pre className="text-emerald-400 whitespace-pre-wrap break-words">{output}</pre>
              </div>
            </div>
          </div>
        </div>
      </StreamCall>
    </StreamTheme>
  );
}