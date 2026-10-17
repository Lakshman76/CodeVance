import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker.js?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker.js?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker.js?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker.js?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker.js?worker";
import { useEffect, useRef } from "react";
import { MonacoBinding } from "y-monaco";

loader.config({ monaco });
globalThis.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") return new jsonWorker();
    if (label === "css" || label === "scss" || label === "less")
      return new cssWorker();
    if (label === "html" || label === "handlebars" || label === "razor")
      return new htmlWorker();
    if (label === "typescript" || label === "javascript") return new tsWorker();
    return new editorWorker();
  },
};

const MonacoEditor = ({
  languages,
  selectedLanguage,
  ytext,
  awareness,
  ready,
}) => {
  const editorRef = useRef(null);
  const bindingRef = useRef(null);
  const language =
    languages.find((item) => item.name === selectedLanguage)?.monaco ||
    "javascript";

  useEffect(() => {
    if (!ready || !editorRef.current) return undefined;
    bindingRef.current?.destroy();
    bindingRef.current = new MonacoBinding(
      ytext,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      awareness,
    );
    return () => {
      bindingRef.current?.destroy();
      bindingRef.current = null;
    };
  }, [ytext, awareness, ready]);

  useEffect(() => {
    const id = "yjs-remote-cursor-styles";
    const style =
      document.getElementById(id) || document.createElement("style");
    style.id = id;
    const updateStyles = () => {
      const css = [];
      awareness.getStates().forEach((state, clientID) => {
        if (clientID === awareness.clientID || !state.user) return;
        const selection = `.yRemoteSelection-${clientID}`;
        const head = `.yRemoteSelectionHead-${clientID}`;
        const color = state.user.color || "#60a5fa";
        const colorLight = state.user.colorLight || "rgba(96,165,250,.2)";
        const name = String(state.user.name || "Collaborator").replace(
          /[\\"\n\r\f]/g,
          (char) => `\\${char.codePointAt(0).toString(16)} `,
        );
        css.push(`${selection}{background-color:${colorLight};}`);
        css.push(`${head}{border-left:2px solid ${color};position:relative;}`);
        css.push(
          `${head}::after{content:"${name}";position:absolute;left:-2px;bottom:100%;background:${color};color:white;font:11px sans-serif;white-space:nowrap;border-radius:3px;padding:2px 5px;pointer-events:none;}`,
        );
      });
      style.textContent = css.join("\n");
      if (!style.isConnected) document.head.appendChild(style);
    };
    updateStyles();
    awareness.on("change", updateStyles);
    return () => {
      awareness.off("change", updateStyles);
      style.remove();
    };
  }, [awareness]);

  return (
    <div className="min-h-0 flex-1 overflow-hidden bg-[#1e1e1e]">
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        language={language}
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
