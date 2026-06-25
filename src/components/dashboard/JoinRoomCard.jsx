const JoinRoomCard = ({
  username,
  roomId,
  setUsername,
  setRoomId,
  handleJoin,
}) => {
  return (
    <section className="flex flex-1 items-center justify-center py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl sm:p-8">
        <div className="mb-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
            Ready to collaborate
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white">
            Join a workspace
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Welcome, {username || "User"}. Create a room or enter an existing
            room ID to start coding together.
          </p>
        </div>

        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-300">
              Username
            </span>

            <input
              type="text"
              placeholder="e.g. lakshman"
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-300">
              Room ID
            </span>

            <input
              type="text"
              placeholder="team-sprint-42"
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 font-mono text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </label>

          <button className="mt-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30 active:translate-y-0">
            Join / Create Room
          </button>
        </form>
      </div>
    </section>
  );
};

export default JoinRoomCard;