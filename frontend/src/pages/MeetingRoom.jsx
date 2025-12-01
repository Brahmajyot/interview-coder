import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
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
import { Loader2, Play, Terminal, Code2, Save } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

export default function MeetingRoom() {
  const { id } = useParams();
  const { user } = useUser();
  
  // State
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(CODE_SNIPPETS["javascript"]);
  const [output, setOutput] = useState("// Output will appear here...");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Stream Video Logic
  const client = useStreamVideoClient();
  const [call, setCall] = useState(null);
  // Removed useCallCallingState here because it must be inside StreamCall
  
  // Ref to ignore our own updates during sync to prevent loops
  const isRemoteUpdate = useRef(false);

  // 1. JOIN CALL EFFECT
  useEffect(() => {
    if (!client || !user) return;
    
    const myCall = client.call("default", id);
    myCall.join({ create: true }).then(() => setCall(myCall));

    return () => {
      myCall.leave();
      setCall(null);
    };
  }, [client, id, user]);

  // 2. REAL-TIME CODE SYNC EFFECT
  useEffect(() => {
    if (!call) return;

    const unsubscribe = call.on("custom", (event) => {
      if (event.type === "code_update") {
        const newCode = event.custom.code;
        const newLang = event.custom.language;

        if (newCode !== code) {
          isRemoteUpdate.current = true; 
          setCode(newCode);
          if (newLang) setLanguage(newLang);
        }
      }
    });

    return () => unsubscribe();
  }, [call, code]);

  // 3. BROADCAST CHANGES
  const handleCodeChange = (value) => {
    setCode(value);

    if (!isRemoteUpdate.current && call) {
      call.sendCustomEvent({
        type: "code_update",
        custom: {
          code: value,
          language: language
        },
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
        custom: {
          code: newCode,
          language: newLang
        },
      });
    }
  };

  // 4. RUN CODE
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

  // 5. SAVE TO DATABASE 
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

      if (response.ok) {
        alert("✅ Code saved to your dashboard!");
      } else {
        alert("❌ Failed to save code.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error saving code.");
    } finally {
      setIsSaving(false);
    }
  };

  // 6. LOADING STATE UI
  if (!call) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-950 text-white">
        <Loader2 className="animate-spin h-10 w-10 text-emerald-500" />
        <span className="ml-3 text-xl font-semibold">Joining Meeting...</span>
      </div>
    );
  }

  // 7. MAIN UI
  return (
    <StreamTheme>
      {/* 2. WRAP WITH STREAMCALL */}
      <StreamCall call={call}>
        <div className="h-screen w-full bg-gray-950 flex flex-col md:flex-row overflow-hidden">
          
          {/* --- LEFT SIDE: VIDEO CALL --- */}
          <div className="flex-1 flex flex-col relative border-r border-gray-800 min-h-[300px] md:min-h-auto">
              <div className="flex-1 bg-gray-900 relative">
                  <SpeakerLayout participantsBarPosition="bottom" />
              </div>
              <div className="bg-gray-950 p-4 flex justify-center border-t border-gray-800">
                  <CallControls />
              </div>
          </div>

          {/* --- RIGHT SIDE: CODE EDITOR --- */}
          <div className="flex-1 flex flex-col bg-gray-900 h-full">
            
            {/* Toolbar */}
            <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 md:px-6 shadow-md">
              <div className="flex items-center gap-3">
                  <Code2 className="h-5 w-5 text-emerald-500" />
                  <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="bg-gray-700 text-white text-sm px-3 py-1.5 rounded-md outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-600 hover:bg-gray-600 cursor-pointer"
                  >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={saveInterview}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-gray-700 hover:bg-gray-600 text-white transition-all border border-gray-600"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-gray-300" />}
                  {isSaving ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={runCode}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-lg ${
                    isLoading 
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed" 
                      : "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-emerald-500/20 hover:scale-105"
                  }`}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                  {isLoading ? "Running..." : "Run"}
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
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            <div className="h-1/3 min-h-[150px] bg-black border-t border-gray-800 flex flex-col">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800">
                  <Terminal className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Console Output</span>
              </div>
              <div className="flex-1 p-4 overflow-auto font-mono text-sm">
                  <pre className={`${output.startsWith("Error") ? "text-red-400" : "text-emerald-400"} whitespace-pre-wrap break-words`}>
                    {output}
                  </pre>
              </div>
            </div>
          </div>
        </div>
      </StreamCall>
    </StreamTheme>
  );
}