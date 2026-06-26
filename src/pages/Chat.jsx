import { useEffect, useRef, useState } from "react";
import { FiMessageSquare, FiSend } from "react-icons/fi";

const Chat = ({ socket, roomId, username }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ✅ Listen for incoming messages (room-safe)
  useEffect(() => {
    const handleMessage = (data) => {
      if (data.roomId !== roomId) return;

      if (data.senderId === socket.id) return;

      setMessages((prev) => [...prev, data]);
    };

    socket.on("chat-message", handleMessage);

    return () => {
      socket.off("chat-message", handleMessage);
    };
  }, [socket, roomId]);

  // ✅ Reset messages when room changes
  useEffect(() => {
    setMessages([]);
  }, [roomId]);

  // Keep the latest message visible after incoming and outgoing updates.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });

    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // ✅ Send message
  const onSend = () => {
    if (!message.trim()) return;

    const msgData = {
      id: crypto.randomUUID(),
      roomId,
      text: message,
      sender: username,
      senderId: socket.id,
    };

    // instant UI update
    setMessages((prev) => [...prev, msgData]);

    socket.emit("chat-message", msgData);

    setMessage("");
  };

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-slate-950/30">
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <FiMessageSquare className="text-cyan-200" />
          <h3 className="text-sm font-semibold text-slate-100">Team chat</h3>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Connected
        </span>
      </div>

      {/* 🔹 Messages */}
      <div
        ref={messagesContainerRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4"
      >
        {messages.length === 0 && (
          <div className="m-auto max-w-[240px] py-8 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-200">
              <FiMessageSquare />
            </div>
            <p className="text-sm font-medium text-slate-300">
              No messages yet
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Start the conversation with your collaborators.
            </p>
          </div>
        )}
        {messages.map((msg) => {
          const mine = msg.senderId === socket.id;

          return (
            <div
              key={msg.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl border px-3 py-2.5 text-sm leading-5 shadow-lg ${
                  mine
                    ? "rounded-br-md border-cyan-300/20 bg-cyan-300/15 text-cyan-50 shadow-cyan-950/10"
                    : "rounded-bl-md border-white/10 bg-white/[0.07] text-slate-200 shadow-black/10"
                }`}
              >
                {/* sender */}
                <div className="mb-1 flex items-center justify-between gap-8">
                  <div
                    className={`text-[10px] font-semibold uppercase tracking-wider ${
                      mine ? "text-cyan-200" : "text-slate-500"
                    }`}
                  >
                    {mine ? "You" : msg.sender}
                  </div>
                </div>

                {/* message */}
                <div className="whitespace-pre-wrap break-words">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Input area */}
      <div className="flex shrink-0 gap-2 border-t border-white/10 bg-white/[0.03] p-3">
        <input
          type="text"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />

        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-3.5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 active:scale-95"
          onClick={onSend}
          aria-label="Send message"
        >
          <FiSend />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
};

export default Chat;
