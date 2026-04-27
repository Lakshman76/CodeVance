import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import axiosInstance from "../config/axiosInstance";

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

  // ✅ Listen for incoming code changes (room-based)
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

      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_GATEWAY}/compiler/run`,
        {
          source_code: encodedCode,
          language_id: langObj.id,
          stdin: input,
          is_base64: true,
        }
      );

      const data = response.data;

      if (data?.stdout) setOutput(data.stdout);
      else if (data?.stderr) setOutput(data.stderr);
      else if (data?.compile_output) setOutput(data.compile_output);
      else setOutput("No output");
    } catch (err) {
      setOutput("Error running code", err);
    }
  };

  return (
    <div style={{ height: "60vh", width: "80vw" }}>
      {/* 🔹 Language Selector */}
      <div className="p-2 bg-gray-800 text-white flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-sm">Language:</label>
          <select
            className="px-2 py-1 rounded bg-gray-900 border border-gray-600"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {languages.map((lang) => (
              <option key={lang.name} value={lang.name}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
          onClick={handleCodeRun}
        >
          Run ▶
        </button>
      </div>

      {/* 🔹 Code Editor */}
      <Editor
        theme="vs-dark"
        language={
          languages.find((lang) => lang.name === selectedLanguage).monaco
        }
        value={code}
        onChange={handleEditorChange}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
      />

      {/* 🔹 Output + Input */}
      <div className="flex h-[28vh] w-full border-t border-gray-700 mt-0.5">
        {/* Output */}
        <div className="w-[70%] bg-gray-950 text-green-400 p-4 overflow-auto border-r border-gray-700">
          <h2 className="font-semibold text-white mb-3 text-sm border-b border-gray-800 pb-2">
            Output:
          </h2>
          <pre className="font-mono text-sm">{output}</pre>
        </div>

        {/* Input */}
        <div className="w-[30%] bg-gray-900 text-white p-4 flex flex-col">
          <h2 className="font-semibold text-sm border-b border-gray-800 pb-2 mb-3">
            Input:
          </h2>
          <textarea
            className="flex-1 bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter input here..."
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
