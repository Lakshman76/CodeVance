import { FiUsers, FiVideo, FiMonitor } from "react-icons/fi";
import ChatPanel from "./ChatPanel";

const CollaborationSidebar = ({
  socket,
  roomId,
  username,
  collaborationTab,
  setCollaborationTab,
}) => {
  return (
    <aside className="flex min-h-[560px] min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl min-[1400px]:h-full min-[1400px]:min-h-0">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
            Collaboration
          </p>
          <h2 className="text-lg font-semibold text-white">
            Room activity
          </h2>
        </div>

        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
          Live
        </span>
      </div>

      {/* Mobile Tabs */}
      <div className="mb-3 hidden shrink-0 grid-cols-3 gap-2 md:grid min-[1400px]:hidden">
        {["people", "call", "chat"].map((tab) => (
          <button
            key={tab}
            onClick={() => setCollaborationTab(tab)}
            className={`rounded-xl px-3 py-2 text-sm capitalize transition ${
              collaborationTab === tab
                ? "bg-cyan-300 text-slate-950"
                : "border border-white/10 bg-slate-950/40 text-slate-300 hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        {/* Participants */}
        <div
          className={`shrink-0 rounded-2xl border border-white/10 bg-slate-950/40 p-4 ${
            collaborationTab === "people"
              ? "md:block"
              : "md:hidden min-[1400px]:block"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
              <FiUsers className="text-cyan-200" />
              Participants
            </h3>

            <span className="text-xs text-slate-500">Soon</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300/15 text-sm font-bold text-cyan-100">
                {(username || "U").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-100">
                  {username}
                </p>
                <p className="text-xs text-emerald-300">You</p>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-3 text-sm text-slate-500">
              Participant list will appear here.
            </div>
          </div>
        </div>

        {/* Video Call */}
        <div
          className={`shrink-0 rounded-2xl border border-white/10 bg-slate-950/40 p-4 ${
            collaborationTab === "call"
              ? "md:block"
              : "md:hidden min-[1400px]:block"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
              <FiVideo className="text-cyan-200" />
              Video call
            </h3>

            <span className="text-xs text-slate-500">Soon</span>
          </div>

          <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-cyan-200/20 bg-gradient-to-br from-cyan-300/10 via-slate-950/60 to-blue-500/10 text-center">
            <div>
              <FiMonitor className="mx-auto mb-2 text-2xl text-cyan-100" />

              <p className="text-sm font-medium text-slate-300">
                Calls and screen sharing
              </p>

              <p className="text-xs text-slate-500">
                Reserved for the next collaboration layer
              </p>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div
          className={`min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 ${
            collaborationTab === "chat"
              ? "flex"
              : "flex md:hidden min-[1400px]:flex"
          }`}
        >
          <ChatPanel
            socket={socket}
            roomId={roomId}
            username={username}
          />
        </div>
      </div>
    </aside>
  );
};

export default CollaborationSidebar;