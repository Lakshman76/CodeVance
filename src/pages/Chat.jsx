import { useEffect, useState } from "react";

const Chat = ({ socket, roomId, username }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // ✅ Listen for incoming messages (room-safe)
  useEffect(() => {
    const handleMessage = (data) => {
      // 🔒 ensure same room
      if (data.roomId !== roomId) return;

      // ❗ ignore own message from server
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

  // ✅ Send message
  function onSend() {
    if (!message.trim()) return;

    const msgData = {
      roomId,
      text: message,
      sender: username,
      senderId: socket.id,
    };

    // instant UI update
    setMessages((prev) => [...prev, msgData]);

    socket.emit("chat-message", msgData);

    setMessage("");
  }

  return (
    <div className="w-lg h-96 border p-2 flex flex-col">
      {/* 🔹 Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-100 flex flex-col">
        {messages.map((msg, i) => {
          const mine = msg.senderId === socket.id;

          return (
            <div
              key={`${msg.senderId}-${i}`}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[78%] p-3 my-2 rounded-[18px] text-sm leading-5 shadow-sm ${
                  mine
                    ? "bg-[#DCF8C6] text-[#303030] rounded-br-2xl"
                    : "bg-white text-[#303030] rounded-bl-2xl"
                }`}
              >
                {/* sender */}
                <div className="flex justify-between items-center mt-1 gap-16">
                  <div className="text-[11px]">{mine ? "You" : msg.sender}</div>
                </div>

                {/* message */}
                <div className="break-words whitespace-pre-wrap font-semibold">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <input
          type="text"
          className="p-2 border flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
        />

        <button
          className="bg-amber-500 px-4 py-2 border rounded-2xl"
          onClick={onSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
