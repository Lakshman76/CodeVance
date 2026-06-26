const InputPanel = ({ input, setInput }) => {
  return (
    <div className="flex min-h-0 flex-col overflow-hidden bg-slate-900/70 p-4 text-white">
      <h2 className="mb-3 border-b border-white/10 pb-3 text-sm font-semibold text-slate-100">
        Standard input
      </h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter program input..."
        className="min-h-24 flex-1 resize-none rounded-xl border border-white/10 bg-slate-950/60 p-3 font-mono text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
      />
    </div>
  );
};

export default InputPanel;