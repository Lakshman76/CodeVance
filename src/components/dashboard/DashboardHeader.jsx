import {
  FiCode,
  FiCopy,
  FiLogOut,
  FiMic,
  FiMonitor,
  FiVideo,
} from "react-icons/fi";

const DashboardHeader = ({
  roomId,
  username,
  joined,
  onLogout,
  onLeaveRoom,
}) => {
  return (
    <nav className="z-30 shrink-0 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 shadow-lg shadow-cyan-500/10">
              <FiCode className="text-xl" />
            </div>

            <div className="min-w-0">
              <h1 className="font-ZenDots text-lg tracking-wide text-white sm:text-xl">
                CodeVance
              </h1>
              <p className="truncate text-xs text-slate-400">
                Collaborative developer workspace
              </p>
            </div>
          </div>

          {/* Mobile Button */}
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-rose-300/20 bg-rose-400/10 px-3 py-2 text-sm font-semibold text-rose-100 transition hover:border-rose-300/40 hover:bg-rose-400/20 xl:hidden"
            onClick={joined ? onLeaveRoom : onLogout}
          >
            <FiLogOut />
            {joined ? "Leave Room" : "Logout"}
          </button>
        </div>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-end">
          {joined && (
            <>
              <div className="grid gap-2 text-sm sm:grid-cols-2 xl:flex xl:items-center">
                <div className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    Room
                  </p>

                  <p className="mt-1 flex min-w-0 items-center gap-2 font-mono text-cyan-100">
                    <span className="truncate">{roomId}</span>

                    <button
                      type="button"
                      className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                      onClick={() => navigator.clipboard?.writeText(roomId)}
                    >
                      <FiCopy />
                    </button>
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    User
                  </p>

                  <p className="mt-1 truncate font-medium text-slate-100">
                    {username}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white">
                  <FiVideo />
                  Video
                </button>

                <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white">
                  <FiMic />
                  Audio
                </button>

                <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white">
                  <FiMonitor />
                  Share
                </button>
              </div>
            </>
          )}

          {/* Action Button */}
          <button
            className="hidden items-center gap-2 rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:border-rose-300/40 hover:bg-rose-400/20 xl:inline-flex"
            onClick={joined ? onLeaveRoom : onLogout}
          >
            <FiLogOut />
            {joined ? "Leave Room" : "Logout"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardHeader;
