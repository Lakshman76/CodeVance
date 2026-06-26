import Editor from "@monaco-editor/react";
import { useRef } from "react";

const MonacoEditor = ({
  languages,
  selectedLanguage,
  code,
  onCodeChange,
}) => {
  const editorRef = useRef(null);

  return (
    <div className="min-h-0 flex-1 overflow-hidden bg-[#1e1e1e]">
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        language={
          languages.find((lang) => lang.name === selectedLanguage).monaco
        }
        value={code}
        onChange={onCodeChange}
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
  );
};

export default MonacoEditor;