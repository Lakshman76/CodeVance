import { useState } from "react";
import Editor from "@monaco-editor/react";
import axiosInstance from "../config/axiosInstance";
import { FiChevronDown, FiPlay, FiTerminal } from "react-icons/fi";
import EditorToolbar from "../components/editors/EditorToolbar";
import MonacoEditor from "../components/editors/MonacoEditor";
import OutputPanel from "../components/editors/OutputPanel";
import InputPanel from "../components/editors/InputPanel";
import useCodeSync from "../hooks/useCodeSync";

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
  const [isRunning, setIsRunning] = useState(false);
  useCodeSync({
    socket,
    roomId,
    code,
    setCode,
  });

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
    setSelectedLanguage(newLang);

    const newCode = languages.find((lang) => lang.name === newLang).code;
    setCode(newCode);

    socket.emit("code-change", {
      code: e.target.value,
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
      />

      {/* 🔹 Code Editor */}
      <MonacoEditor
        languages={languages}
        selectedLanguage={selectedLanguage}
        code={code}
        onCodeChange={handleEditorChange}
      />

      {/* 🔹 Output + Input */}
      <div className="grid h-[300px] shrink-0 border-t border-white/10 md:h-[240px] md:grid-cols-[minmax(0,1.65fr)_minmax(260px,1fr)]">
        <OutputPanel output={output} />

        <InputPanel input={input} setInput={setInput} />
      </div>
    </div>
  );
};

export default CodeEditor;
