import { FiUsers } from "react-icons/fi";

const ParticipantPanel = ({ username, participants, collaborationTab }) => {
  const avatarColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];

  const getAvatarColor = (name) => {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
      hash += name.charCodeAt(i);
    }

    return avatarColors[hash % avatarColors.length];
  };
  return (
    <div
      className={`h-full min-h-0 flex flex-col rounded-2xl border border-white/10 bg-slate-950/40 p-4 ${
        collaborationTab === "people"
          ? "md:flex"
          : "hidden md:hidden min-[1400px]:flex"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
          <FiUsers className="text-cyan-200" />
          Participants
        </h3>

        <span className="rounded-full bg-cyan-300/10 px-2 py-1 text-xs text-cyan-200">
          {participants.length}
        </span>
      </div>

      <div className="mt-2 flex-1 overflow-y-auto">
        <div className="space-y-2 pr-1">
          {participants.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-3 text-center text-sm text-slate-500">
              No participants
            </div>
          ) : (
            participants.map((user) => {
              const isYou = user.username === username;

              return (
                <div
                  key={user.socketId}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${getAvatarColor(
                      user.username,
                    )}`}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-100">
                      {user.username}
                    </p>

                    {isYou && <p className="text-xs text-emerald-300">You</p>}
                  </div>

                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantPanel;
