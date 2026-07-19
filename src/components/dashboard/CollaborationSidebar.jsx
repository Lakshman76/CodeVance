import { FiUsers, FiVideo, FiMonitor } from "react-icons/fi";
import ChatPanel from "./ChatPanel";
import ParticipantPanel from "./ParticipantsPanel";

const CollaborationSidebar = ({
  socket,
  roomId,
  username,
  collaborationTab,
  participants,
  setCollaborationTab,
  isMuted,
}) => {
  return (
    <aside className="flex min-h-[560px] min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl min-[1400px]:h-full min-[1400px]:min-h-0">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
            Collaboration
          </p>
          <h2 className="text-lg font-semibold text-white">Room activity</h2>
        </div>

        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
          Live
        </span>
      </div>

      {/* Mobile Tabs */}
      <div className="mb-3 hidden shrink-0 grid-cols-2 gap-2 md:grid min-[1400px]:hidden">
        {["people", "chat"].map((tab) => (
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
        <ParticipantPanel
          username={username}
          participants={participants}
          collaborationTab={collaborationTab}
          isMuted={isMuted}
        />

        {/* Chat */}
        <div
          className={`min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 ${
            collaborationTab === "chat"
              ? "flex"
              : "flex md:hidden min-[1400px]:flex"
          }`}
        >
          <ChatPanel socket={socket} roomId={roomId} username={username} />
        </div>
      </div>
    </aside>
  );
};

export default CollaborationSidebar;
