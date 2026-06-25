import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import axiosInstance from "../config/axiosInstance";
import { FiChevronDown, FiPlay, FiTerminal } from "react-icons/fi";

const languages = [
  {
    name: "JavaScript",
    monaco: "javascript",
    code: `console.log("Hello World");`,
    id: 63,
  },
  {
    name: "Python",
    monaco: "python",
    code: `print("Hello World")`,
    id: 71,
  },
  {
    name: "Java",
    monaco: "java",
    code: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`,
    id: 62,
  },
  {
    name: "C",
    monaco: "c",
    code: `#include <stdio.h>
int main() {
  printf("Hello World");
  return 0;
}`,
    id: 104,
  },
  {
    name: "C++",
    monaco: "cpp",
    code: `#include <iostream>
using namespace std;
int main() {
  cout << "Hello World";
  return 0;
}`,
    id: 54,
  },
];

const CodeEditor = ({ socket, roomId }) => {
  const [code, setCode] = useState(languages[0].code);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].name);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");

  const editorRef = useRef(null);

  // ✅ CODE SYNC
  useEffect(() => {
    const handleCodeChange = ({ roomId: incomingRoom, code }) => {
      if (incomingRoom !== roomId) return;

      setCode((prev) => (prev !== code ? code : prev));
    };

    socket.on("code-change", handleCodeChange);

    return () => {
      socket.off("code-change", handleCodeChange);
    };
  }, [socket, roomId]);

  // ✅ HANDLE REQUEST FOR CODE
  useEffect(() => {
    const handleRequestCode = ({ targetSocketId }) => {
      socket.emit("send-code", {
        targetSocketId,
        code,
        roomId,
      });
    };

    socket.on("request-code", handleRequestCode);

    return () => {
      socket.off("request-code", handleRequestCode);
    };
  }, [socket, code, roomId]);

  // ✅ RECEIVE INITIAL CODE
  useEffect(() => {
    const handleReceiveCode = ({
      code: incomingCode,
      roomId: incomingRoom,
    }) => {
      if (incomingRoom !== roomId) return;

      setCode((prev) => (prev !== incomingCode ? incomingCode : prev));
    };

    socket.on("receive-code", handleReceiveCode);

    return () => {
      socket.off("receive-code", handleReceiveCode);
    };
  }, [socket, roomId]);

  // ✅ Emit code changes
  const handleEditorChange = (value) => {
    setCode(value);

    socket.emit("code-change", {
      roomId,
      code: value,
    });
  };

  // ✅ Handle language change + sync
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);

    const newCode = languages.find((lang) => lang.name === newLang).code;
    setCode(newCode);

    socket.emit("code-change", {
      roomId,
      code: newCode,
    });
  };

  // ✅ Run code safely
  const handleCodeRun = async () => {
    try {
      const encodedCode = btoa(code);

      const langObj = languages.find((lang) => lang.name === selectedLanguage);

      const response = await axiosInstance.post("/compiler/run", {
        source_code: encodedCode,
        language_id: langObj.id,
        stdin: input,
        is_base64: true,
      });

      const data = response.data;

      if (data?.stdout) setOutput(data.stdout);
      else if (data?.stderr) setOutput(data.stderr);
      else if (data?.compile_output) setOutput(data.compile_output);
      else setOutput("No output");
    } catch (err) {
      setOutput(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#070b14]">
      {/* 🔹 Language Selector */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-3 py-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 sm:flex">
            <FiTerminal />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.75)]" />
              <p className="truncate text-sm font-semibold text-slate-100">
                Main workspace
              </p>
            </div>
            <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
              Changes sync with everyone in this room
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative">
            <span className="sr-only">Language</span>
            <select
              className="h-10 appearance-none rounded-xl border border-white/10 bg-slate-950/70 py-2 pl-3 pr-9 text-sm font-medium text-slate-200 outline-none transition hover:border-white/20 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              {languages.map((lang) => (
                <option key={lang.name} value={lang.name}>
                  {lang.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
          </label>

          <button
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-4 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/15 transition hover:-translate-y-0.5 hover:shadow-cyan-500/25 active:translate-y-0"
            onClick={handleCodeRun}
          >
            <FiPlay className="fill-current" />
            Run
          </button>
        </div>
      </div>

      {/* 🔹 Code Editor */}
      <div className="min-h-0 flex-1 overflow-hidden bg-[#1e1e1e]">
        <Editor
          height="100%"
          width="100%"
          theme="vs-dark"
          language={
            languages.find((lang) => lang.name === selectedLanguage).monaco
          }
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
        />
      </div>

      {/* 🔹 Output + Input */}
      <div className="grid h-[300px] shrink-0 border-t border-white/10 md:h-[240px] md:grid-cols-[minmax(0,1.65fr)_minmax(260px,1fr)]">
        {/* Output */}
        <div className="min-h-0 overflow-y-auto border-b border-white/10 bg-slate-950/80 p-4 text-emerald-300 md:border-b-0 md:border-r">
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
              <FiTerminal className="text-emerald-300" />
              Output
            </h2>
            <span className="rounded-md bg-white/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Console
            </span>
          </div>
          <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-6">
            {output || (
              <span className="text-slate-600">Run your code to see output…</span>
            )}
          </pre>
        </div>

        {/* Input */}
        <div className="flex min-h-0 flex-col overflow-hidden bg-slate-900/70 p-4 text-white">
          <h2 className="mb-3 border-b border-white/10 pb-3 text-sm font-semibold text-slate-100">
            Standard input
          </h2>
          <textarea
            className="min-h-24 flex-1 resize-none rounded-xl border border-white/10 bg-slate-950/60 p-3 font-mono text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter program input…"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
