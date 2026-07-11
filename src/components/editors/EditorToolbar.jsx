import { FiChevronDown, FiPlay, FiTerminal } from "react-icons/fi";

const EditorToolbar = ({
  languages,
  selectedLanguage,
  onLanguageChange,
  onRunCode,
  isRunning,
}) => {
  return (
    <div className="relative flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-3 py-3 sm:px-4">
      {/* Progress bar */}
      {isRunning && (
        <div className="absolute bottom-0 left-0 h-[2px] w-full overflow-hidden">
          <div className="h-full w-1/3 animate-[loading_1.2s_linear_infinite] bg-cyan-300" />
        </div>
      )}

      {/* Left Side */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 sm:flex">
          <FiTerminal />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                isRunning
                  ? "animate-pulse bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.8)]"
                  : "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.75)]"
              }`}
            />

            <p className="truncate text-sm font-semibold text-slate-100">
              Main Workspace
            </p>
          </div>

          <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
            {isRunning
              ? "Executing your program..."
              : "Changes sync with everyone in this room"}
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <label className="relative">
          <span className="sr-only">Language</span>

          <select
            disabled={isRunning}
            value={selectedLanguage}
            onChange={onLanguageChange}
            className={`h-10 appearance-none rounded-xl border border-white/10 bg-slate-950/70 py-2 pl-3 pr-9 text-sm font-medium text-slate-200 outline-none transition focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10 ${
              isRunning
                ? "cursor-not-allowed opacity-60"
                : "hover:border-white/20"
            }`}
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
          disabled={isRunning}
          className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-bold transition-all duration-300 ease-out ${
            isRunning
              ? "scale-95 cursor-not-allowed border-cyan-400/30 bg-cyan-500/10 text-cyan-200"
              : "bg-gradient-to-r from-cyan-300 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/15 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-cyan-500/25 active:scale-95"
          }`}
        >
          {isRunning ? (
            <>
              <svg
                className="h-4 w-4 animate-spin text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.25"
                />
                <path
                  d="M22 12a10 10 0 0 1-10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              Executing...
            </>
          ) : (
            <>
              <FiPlay className="fill-current" />
              Run
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;