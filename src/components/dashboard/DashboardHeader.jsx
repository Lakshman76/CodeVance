import {
  FiCode,
  FiCopy,
  FiLogOut,
  FiMic,
  FiMicOff,
  FiMonitor,
  FiVideo,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const DashboardHeader = ({
  roomId,
  username,
  joined,
  onLogout,
  onLeaveRoom,
  isMuted,
  onToggleMic,
}) => {
  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };
  return (
    <nav className="z-30 shrink-0 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl">
      <div className="min-h-14 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <motion.div variants={itemVariants}>
            <Link to="/" className="z-50">
              <motion.h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl text-[#F4E7E1] font-thin font-ZenDots">
                C
                <span className="mx-0.5 sm:mx-1 font-thin text-[#626F47]">
                  o
                </span>
                deVance
              </motion.h1>
            </Link>
          </motion.div>

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

                <button
                  onClick={onToggleMic}
                  className={`inline-flex h-11 w-[120px] items-center justify-center gap-2 rounded-xl border transition-all duration-300 ${
                    isMuted
                      ? "border-rose-400/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                      : "border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                  }`}
                >
                  {isMuted ? (
                    <FiMicOff size={18} strokeWidth={2.3} />
                  ) : (
                    <FiMic size={18} strokeWidth={2.3} />
                  )}

                  <span>{isMuted ? "Mic Off" : "Mic On"}</span>
                </button>
              </div>
            </>
          )}

          {/* Action Button */}
          <button
            className="hidden items-center gap-4 rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:border-rose-300/40 hover:bg-rose-400/20 xl:inline-flex"
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
