import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

const defaultCode = {
  javascript: `console.log("Hello World");`,

  python: `print("Hello World")`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,

  c: `#include <stdio.h>
int main() {
    printf("Hello World");
    return 0;
}`,

  cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello World";
    return 0;
}`,
};

const CodeEditor = ({ socket }) => {
  const [code, setCode] = useState(defaultCode.javascript);
  const [language, setLanguage] = useState("javascript");

  const editorRef = useRef(null);

  useEffect(() => {
    socket.on("code-change", (incomingCode) => {
      if (incomingCode !== code) {
        setCode(incomingCode);
      }
    });
    return () => {
      socket.off("code-change");
    };
  }, [code, socket]);

  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit("code-change", value);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(defaultCode[selectedLanguage]);
  };
  return (
    <div style={{ height: "100vh", width: "80vw" }}>
      {/* Language Selector */}
      <div className="p-2 bg-gray-800 text-white flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-sm">Language:</label>
          <select
            className="px-2 py-1 rounded bg-gray-900 border border-gray-600"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
        </div>
        <button className="px-3 py-1 bg-green-600 rounded hover:bg-green-700">
          Run ▶
        </button>
      </div>

      {/* Editor */}
      <Editor
        theme="vs-dark"
        language={language}
        value={code}
        onChange={handleEditorChange}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
};

export default CodeEditor;
