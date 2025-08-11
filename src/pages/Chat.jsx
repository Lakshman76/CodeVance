import { useEffect, useState } from "react";

const Chat = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // store chat history

  useEffect(() => {
    socket.on("chat-message", (data) => {
      setMessages((prev) => [...prev, data]); // append incoming message
    });

    return () => {
      socket.off("chat-message");
    };
  }, [socket]);

  function onSend(e) {
    e.preventDefault();
    if (!message.trim()) return; // prevent sending empty messages

    socket.emit("chat-message", {
      senderId: socket.id,
      text: message,
    });
    setMessage("");
  }

  return (
    <div className="w-lg h-96 border p-2 flex flex-col">
      {/* Messages display */}
      <div className="flex-1 overflow-y-auto border mb-2 p-2">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">
            <strong>
              {msg.senderId === socket.id ? "You" : msg.senderId} :
            </strong>{" "}
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <input
          type="text"
          className="p-2 border flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
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
