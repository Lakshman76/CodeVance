import { FiChevronDown, FiPlay, FiTerminal } from "react-icons/fi";

const EditorToolbar = ({
  languages,
  selectedLanguage,
  onLanguageChange,
  onRunCode,
}) => {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-3 py-3 sm:px-4">
      {/* Left Side */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 sm:flex">
          <FiTerminal />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.75)]" />
            <p className="truncate text-sm font-semibold text-slate-100">
              Main Workspace
            </p>
          </div>

          <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
            Changes sync with everyone in this room
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <label className="relative">
          <span className="sr-only">Language</span>

          <select
            value={selectedLanguage}
            onChange={onLanguageChange}
            className="h-10 appearance-none rounded-xl border border-white/10 bg-slate-950/70 py-2 pl-3 pr-9 text-sm font-medium text-slate-200 outline-none transition hover:border-white/20 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10"
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
          onClick={onRunCode}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-4 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/15 transition hover:-translate-y-0.5 hover:shadow-cyan-500/25 active:translate-y-0"
        >
          <FiPlay className="fill-current" />
          Run
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;