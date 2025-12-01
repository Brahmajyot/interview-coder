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
  
  // Security State
  const [encryptionKey, setEncryptionKey] = useState(""); 
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Audio State
  const [isSpeaking, setIsSpeaking] = useState(false);

  const client = useStreamVideoClient();
  const [call, setCall] = useState(null);
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    if (!client || !user) return;
    const myCall = client.call("default", id);
    myCall.join({ create: true }).then(() => setCall(myCall));
    return () => {
      myCall.leave();
      setCall(null);
    };
  }, [client, id, user]);

  // Encryption Helpers
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

  // --- NEW: TEXT TO SPEECH FUNCTION ---
  const speakCode = () => {
    if (!('speechSynthesis' in window)) {
      alert("Your browser does not support text-to-speech.");
      return;
    }
    
    // Stop any current speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(code);
    utterance.rate = 0.9; // Slightly slower for code clarity
    utterance.pitch = 1;
    
    // Select a voice (Preferably Google or Microsoft English)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => voice.lang.includes('en') && voice.name.includes('Google')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Real-Time Sync
  useEffect(() => {
    if (!call) return;
    const unsubscribe = call.on("custom", (event) => {
      if (event.type === "code_update") {
        const incomingCode = event.custom.code;
        const newLang = event.custom.language;
        const decryptedCode = encryptionKey ? decrypt(incomingCode) : incomingCode;

        if (decryptedCode !== code) {
          isRemoteUpdate.current = true; 
          setCode(decryptedCode);
          if (newLang) setLanguage(newLang);
        }
      }
    });
    return () => unsubscribe();
  }, [call, code, encryptionKey]);

  const handleCodeChange = (value) => {
    setCode(value);
    if (!isRemoteUpdate.current && call) {
      const payload = encryptionKey ? encrypt(value) : value;
      call.sendCustomEvent({
        type: "code_update",
        custom: { code: payload, language: language },
      });
    }
    isRemoteUpdate.current = false; 
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

  const runCode = async () => {
    setIsLoading(true);
    try {
      const result = await executeCode(language, code);
      setOutput(result.run.output || result.message || "Execution success (No output)");
    } catch (error) {
      setOutput("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveInterview = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          language: language,
          code: code,
          title: `Interview - ${new Date().toLocaleString()}`
        }),
      });
      if (response.ok) alert("✅ Saved!");
      else alert("❌ Save failed.");
    } catch (error) {
      alert("❌ Error saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!call) return <div className="h-screen flex items-center justify-center bg-gray-950 text-white"><Loader2 className="animate-spin" /></div>;

  return (
    <StreamTheme>
      <StreamCall call={call}>
        <div className="h-screen w-full bg-gray-950 flex flex-col md:flex-row overflow-hidden">
          
          <div className="flex-1 flex flex-col relative border-r border-gray-800 min-h-[300px] md:min-h-auto">
              <div className="flex-1 bg-gray-900 relative">
                  <SpeakerLayout participantsBarPosition="bottom" />
              </div>
              <div className="bg-gray-950 p-4 flex items-center justify-center gap-4 border-t border-gray-800">
                  <CallControls onLeave={() => navigate('/')} />
                  <button onClick={() => call.screenShare.toggle()} className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors" title="Share Screen">
                    <MonitorUp className="h-5 w-5" />
                  </button>
              </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-900 h-full">
            <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 md:px-6 shadow-md">
              <div className="flex items-center gap-3">
                  <Code2 className="h-5 w-5 text-emerald-500" />
                  <select value={language} onChange={handleLanguageChange} className="bg-gray-700 text-white text-sm px-3 py-1.5 rounded-md border border-gray-600 outline-none">
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                  </select>
              </div>

              <div className="flex gap-2 items-center">
                {showKeyInput && (
                  <input 
                    type="password" 
                    placeholder="Secret Key" 
                    value={encryptionKey}
                    onChange={(e) => setEncryptionKey(e.target.value)}
                    className="bg-gray-900 text-white text-xs px-2 py-2 rounded border border-emerald-500/50 outline-none w-24"
                  />
                )}
                
                {/* 🔒 Encryption Button */}
                <button onClick={() => setShowKeyInput(!showKeyInput)} className={`p-2 rounded-lg transition-all ${encryptionKey ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-700 text-gray-400 hover:text-white"}`} title="Encryption">
                  {encryptionKey ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </button>

                {/* 🔊 Speak Code Button */}
                <button 
                  onClick={isSpeaking ? stopSpeaking : speakCode} 
                  className={`p-2 rounded-lg transition-all ${isSpeaking ? "bg-red-500/20 text-red-400" : "bg-gray-700 text-gray-400 hover:text-white"}`} 
                  title={isSpeaking ? "Stop Reading" : "Read Code Aloud"}
                >
                  {isSpeaking ? <StopCircle className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>

                <button onClick={saveInterview} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-gray-700 hover:bg-gray-600 text-white transition-all border border-gray-600">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-gray-300" />}
                  <span className="hidden sm:inline">Save</span>
                </button>

                <button onClick={runCode} disabled={isLoading} className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-emerald-500/20 hover:scale-105 transition-all shadow-lg">
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
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Console</span>
              </div>
              <div className="flex-1 p-4 overflow-auto font-mono text-sm">
                  <pre className={`${output.startsWith("Error") ? "text-red-400" : "text-emerald-400"} whitespace-pre-wrap break-words`}>{output}</pre>
              </div>
            </div>
          </div>
        </div>
      </StreamCall>
    </StreamTheme>
  );
}