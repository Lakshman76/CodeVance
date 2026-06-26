import { FiTerminal } from "react-icons/fi";

const OutputPanel = ({ output }) => {
  return (
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
          <span className="text-slate-600">
            Run your code to see output...
          </span>
        )}
      </pre>
    </div>
  );
};

export default OutputPanel;