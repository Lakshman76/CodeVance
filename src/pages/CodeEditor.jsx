import { useState } from "react";
import axiosInstance from "../config/axiosInstance";
import EditorToolbar from "../components/editors/EditorToolbar";
import MonacoEditor from "../components/editors/MonacoEditor";
import OutputPanel from "../components/editors/OutputPanel";
import InputPanel from "../components/editors/InputPanel";
import Whiteboard from "../components/editors/Whiteboard";
import useCodeSync from "../hooks/useCodeSync";
import useWhiteboardSync from "../hooks/useWhiteboardSync";
import useViewSync from "../hooks/useViewSync";

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

const CodeEditor = ({ socket, roomId, username }) => {
  const [code, setCode] = useState(languages[0].code);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].name);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [view, setView] = useState("code");
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  useCodeSync({
    socket,
    roomId,
    code,
    setCode,
    selectedLanguage,
    setSelectedLanguage,
  });
  const { onChange: onWhiteboardChange, onPointerUpdate } = useWhiteboardSync({
    socket,
    roomId,
    username,
    excalidrawAPI,
  });
  useViewSync({ socket, roomId, view, setView });

  const handleViewChange = (nextView) => {
    setView(nextView);
    socket.emit("view-change", { view: nextView });
  };

  // ✅ Emit code changes
  const handleEditorChange = (value) => {
    setCode(value);

    socket.emit("code-change", {
      code: value,
    });
  };

  // ✅ Handle language change + sync
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    const newCode = languages.find((lang) => lang.name === newLang).code;

    setSelectedLanguage(newLang);
    setCode(newCode);

    socket.emit("language-change", {
      language: newLang,
      code: newCode,
    });
  };

  // ✅ Run code safely
  const handleCodeRun = async () => {
    if (isRunning) return;
    try {
      setIsRunning(true);
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
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#070b14]">
      {/* 🔹 Language Selector */}
      <EditorToolbar
        languages={languages}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        onRunCode={handleCodeRun}
        isRunning={isRunning}
        view={view}
        onViewChange={handleViewChange}
      />

      <div className="relative min-h-0 flex-1">
        <div
          className={`absolute inset-0 flex min-h-0 flex-col transition-all duration-200 ${view === "code" ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`}
          aria-hidden={view !== "code"}
        >
          <MonacoEditor
            languages={languages}
            selectedLanguage={selectedLanguage}
            code={code}
            onCodeChange={handleEditorChange}
          />
          <div className="grid h-[300px] shrink-0 border-t border-white/10 md:h-[240px] md:grid-cols-[minmax(0,1.65fr)_minmax(260px,1fr)]">
            <OutputPanel output={output} />
            <InputPanel input={input} setInput={setInput} />
          </div>
        </div>
        <div
          className={`absolute inset-0 transition-all duration-200 ${view === "whiteboard" ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`}
          aria-hidden={view !== "whiteboard"}
        >
          <Whiteboard
            setExcalidrawAPI={setExcalidrawAPI}
            onChange={onWhiteboardChange}
            onPointerUpdate={onPointerUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
