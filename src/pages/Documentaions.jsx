// Documentation.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  FiCode,
  FiMessageSquare,
  FiUsers,
  FiLayers,
  FiCpu,
  FiSmartphone,
  FiCheckCircle,
  FiArrowDown,
} from "react-icons/fi";

const features = [
  {
    icon: <FiCode size={24} />,
    title: "Real-Time Code Editor",
    items: [
      "Monaco Editor",
      "Instant synchronization",
      "Multiple languages",
      "Room based editing",
    ],
  },
  {
    icon: <FiMessageSquare size={24} />,
    title: "Team Chat",
    items: [
      "Live messaging",
      "Join/Leave notifications",
      "Auto-scroll",
      "Room-only messages",
    ],
  },
  {
    icon: <FiUsers size={24} />,
    title: "Participants",
    items: [
      "Live participant list",
      "Dynamic avatars",
      "Online indicators",
      "Auto updates",
    ],
  },
  {
    icon: <FiLayers size={24} />,
    title: "Rooms",
    items: ["Create room", "Join room", "Leave room", "Invite collaborators"],
  },
  {
    icon: <FiCpu size={24} />,
    title: "Socket.IO",
    items: ["Real-time events", "Code sync", "Chat sync", "Participant sync"],
  },
  {
    icon: <FiSmartphone size={24} />,
    title: "Modern UI",
    items: ["Responsive", "Glassmorphism", "Framer Motion", "Dark theme"],
  },
];
const completed = [
  "Real-time collaborative editor",
  "Room-based collaboration",
  "Live participant list",
  "Team chat",
  "Join notifications",
  "Leave notifications",
  "Dynamic avatars",
  "Instant code synchronization",
  "Responsive dashboard",
  "Modern glassmorphism UI",
];
const roadmap = [
  "Video Calling",
  "Screen Sharing",
  "Voice Chat",
  "File Sharing",
  "Authentication",
  "Persistent Room History",
  "Collaborative Whiteboard",
];

export default function Documentation() {
  return (
    <section
      className="min-h-screen pt-32 pb-20 px-6 text-white"
      style={{
        backgroundImage: `linear-gradient(to right,#000,#2f3743),repeating-linear-gradient(0deg,rgba(255,255,255,.06)0 1px,transparent 1px 90px),repeating-linear-gradient(90deg,rgba(255,255,255,.05)0 1px,transparent 1px 80px)`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="uppercase tracking-[0.35em] text-cyan-300">
            Documentation
          </p>
          <h1 className="text-6xl font-bold mt-4">CodeVance</h1>
          <p className="text-xl text-slate-300 mt-6 max-w-3xl">
            Everything you need to collaborate, code and communicate in real
            time.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
          {features.map((f) => (
            <motion.div
              whileHover={{ y: -8 }}
              key={f.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="text-cyan-300">{f.icon}</div>
              <h3 className="text-xl font-semibold mt-4">{f.title}</h3>
              <ul className="mt-4 space-y-2 text-slate-300">
                {f.items.map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <div className="mt-24">
          <h2 className="text-3xl font-bold mb-8">Architecture</h2>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            React + Monaco Editor
            <div>
              <FiArrowDown className="mx-auto" />
            </div>
            Socket.IO Client
            <div>
              <FiArrowDown className="mx-auto" />
            </div>
            Express + Socket.IO Server
            <div>
              <FiArrowDown className="mx-auto" />
            </div>
            Rooms • Chat • Participants • Code Sync
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-10 mt-24">
          <div>
            <h2 className="text-3xl font-bold mb-6">Implemented Features</h2>
            {completed.map((c) => (
              <div
                key={c}
                className="flex items-center gap-3 border border-white/10 bg-white/5 rounded-xl p-4 mb-3"
              >
                <FiCheckCircle className="text-emerald-400" />
                {c}
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Roadmap</h2>
            {roadmap.map((r) => (
              <div
                key={r}
                className="rounded-xl border border-dashed border-cyan-300/20 bg-cyan-300/5 p-4 mb-3"
              >
                {r}
              </div>
            ))}
          </div>
        </div>
        <footer className="mt-24 pt-8 border-t border-white/10 text-center text-slate-400">
          Built with React • TailwindCSS • Framer Motion • Socket.IO • Monaco
          Editor • Express.js
        </footer>
      </div>
    </section>
  );
}
