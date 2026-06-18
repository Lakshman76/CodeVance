import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import axiosInstance from "../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import CodeEditor from "../pages/CodeEditor";
import { io } from "socket.io-client";
import Chat from "../pages/Chat";

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

  // ✅ Save to localStorage only when valid
  useEffect(() => {
    if (username && roomId) {
      localStorage.setItem("username", username);
      localStorage.setItem("roomId", roomId);
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

  return (
    <>
      {/* 🔝 Navbar */}
      <div className="p-6 flex justify-between items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Collaborative Code Editor
        </h1>
        <button
          className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-semibold rounded-lg shadow-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {!joined ? (
        // 🔹 Join Room UI
        <div className="h-screen flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold text-black text-center mb-2">
            Welcome, {username || "User"}!
          </h1>

          <h2 className="text-xl font-semibold mb-4">Join Room</h2>

          <form onSubmit={handleJoin} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Username"
              className="p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="text"
              placeholder="Room ID"
              className="p-2 border rounded"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />

            <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
              Join / Create Room
            </button>
          </form>
        </div>
      ) : (
        // 🔹 Main App (Editor + Chat)
        <div className="flex h-[calc(100vh-73px)]">
          <CodeEditor socket={socket} roomId={roomId} />
          <Chat socket={socket} roomId={roomId} username={username} />
        </div>
      )}
    </>
  );
};

export default Dashboard;
