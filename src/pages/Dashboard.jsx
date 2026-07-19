import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axiosInstance from "../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import { io } from "socket.io-client";
import useAudioCall from "../hooks/useAudioCall";

import JoinRoomCard from "../components/dashboard/JoinRoomCard";
import CollaborationSidebar from "../components/dashboard/CollaborationSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";

// ✅ Single socket instance
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5003", {
  autoConnect: true,
  transports: ["websocket"],
});

const Dashboard = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [collaborationTab, setCollaborationTab] = useState("chat");
  const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(true);

  const {
    localStream,
    stopMicrophone,
    unmuteMicrophone,
    createOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    addAudioTrackToPeers,
  } = useAudioCall();

  // ✅ Save to localStorage only when valid
  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username);
    }

    if (roomId) {
      localStorage.setItem("roomId", roomId);
    } else {
      localStorage.removeItem("roomId");
    }
  }, [username, roomId]);

  // ✅ Auto-join on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    const savedRoom = localStorage.getItem("roomId");

    if (savedUser && savedRoom) {
      setUsername(savedUser);
      setRoomId(savedRoom);

      socket.emit("join_room", {
        roomId: savedRoom,
        username: savedUser,
      });

      setJoined(true);
    }
  }, []);

  useEffect(() => {
    socket.on("participants", (users) => {
      setParticipants(users);
    });

    return () => socket.off("participants");
  }, []);

  useEffect(() => {
    if (!joined) return;

    socket.emit("toggle-mic", {
      isMuted,
    });
  }, [isMuted, joined]);

  useEffect(() => {
    socket.on("new-peer", ({ socketId }) => {
      console.log("🆕 New Peer:", socketId);

      createOffer(socket, socketId);
    });

    return () => {
      socket.off("new-peer");
    };
  }, [createOffer]);

  useEffect(() => {
    socket.on("offer", ({ sender, offer }) => {
      console.log("📥 Offer received");

      handleOffer(socket, sender, offer);
    });

    return () => {
      socket.off("offer");
    };
  }, [handleOffer]);

  useEffect(() => {
    socket.on("answer", ({ sender, answer }) => {
      console.log("📥 Answer received");

      handleAnswer(sender, answer);
    });

    return () => {
      socket.off("answer");
    };
  }, [handleAnswer]);

  useEffect(() => {
    socket.on("ice-candidate", ({ sender, candidate }) => {
      handleIceCandidate(sender, candidate);
    });

    return () => socket.off("ice-candidate");
  }, [handleIceCandidate]);

  // ✅ Logout handler
  function onLogout(e) {
    e.preventDefault();

    // clear local storage
    localStorage.removeItem("username");
    localStorage.removeItem("roomId");

    toast.promise(axiosInstance.post("/auth/logout"), {
      loading: "Logging out...",
      success: (data) => {
        navigate("/");
        return data.data;
      },
      error: (err) => {
        navigate("/get-started");
        return err.response?.data || "Error logging out";
      },
    });
  }
  // ✅ Leave room
  function handleLeaveRoom() {
    stopMicrophone();
    socket.emit("leave_room", {
      roomId,
      username,
    });

    localStorage.removeItem("roomId");

    setRoomId("");
    setJoined(false);

    toast.success("Left room successfully");
  }

  // ✅ Join room handler
  function handleJoin(e) {
    e.preventDefault();

    if (!roomId.trim() || !username.trim()) {
      return toast.error("Enter username and room ID");
    }

    socket.emit("join_room", { roomId, username });

    toast.success(`Joined room: ${roomId}`);
    setJoined(true);
  }

  const handleToggleMic = async () => {
    try {
      if (isMuted) {
        // First time → asks for permission.
        // Later → simply enables the existing track.
        const wasEmpty = !localStream.current;

        await unmuteMicrophone();

        // Only add tracks once.
        if (wasEmpty) {
          addAudioTrackToPeers();
        }
      } else {
        stopMicrophone();
      }

      setIsMuted((prev) => !prev);
    } catch (err) {
      toast.error("Microphone permission denied");
      console.log(err);
    }
  };

  return (
    <main className="relative h-screen overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-50 [background-image:linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:76px_76px]" />
      <div className="pointer-events-none fixed -left-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-cyan-400/15 blur-[130px]" />
      <div className="pointer-events-none fixed -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-indigo-500/15 blur-[130px]" />

      <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[1800px] flex-col px-3 py-3 sm:px-5 lg:px-6">
        {/* 🔝 Navbar */}
        <DashboardHeader
          roomId={roomId}
          username={username}
          joined={joined}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          onLogout={onLogout}
          onLeaveRoom={handleLeaveRoom}
          onToggleMic={handleToggleMic}
        />
        {!joined ? (
          // 🔹 Join Room UI
          <JoinRoomCard
            username={username}
            roomId={roomId}
            setUsername={setUsername}
            setRoomId={setRoomId}
            handleJoin={handleJoin}
          />
        ) : (
          // 🔹 Main App (Editor + Chat)
          <section className="grid min-h-0 flex-1 gap-4 overflow-y-auto py-4 min-[1400px]:h-full min-[1400px]:grid-cols-[minmax(0,1fr)_420px] min-[1400px]:overflow-hidden">
            <div className="min-h-[700px] min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-2 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl sm:p-3 min-[1400px]:min-h-0">
              <CodeEditor socket={socket} roomId={roomId} />
            </div>

            {/* aside */}
            <CollaborationSidebar
              socket={socket}
              roomId={roomId}
              username={username}
              collaborationTab={collaborationTab}
              setCollaborationTab={setCollaborationTab}
              participants={participants}
              isMuted={isMuted}
            />
          </section>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
