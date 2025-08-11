import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ socket }) => {
  const [code, setCode] = useState("");

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
  }, [code]);

  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit("code-change", value);
  };
  return (
    <div style={{ height: "100vh", width: "80vw" }}>
      <Editor
        theme="vs-dark"
        defaultLanguage="javascript"
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
