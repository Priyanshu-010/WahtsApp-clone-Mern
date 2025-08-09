import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { CheckIcon, CheckDoubleIcon } from "../utils/StatusIcons";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000");

export default function ChatWindow({ wa_id, name, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/messages/${wa_id}`
      )
      .then((res) => setMessages(res.data));

    socket.on("new-message", (msg) => {
      if (msg.wa_id === wa_id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("message-status-update", (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      );
    });

    return () => socket.off("new-message");
  }, [wa_id]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await axios.post(
      `${
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      }/api/messages/send`,
      {
        wa_id,
        name: "You",
        text: input,
      }
    );
    setInput("");
  };

  return (
    <div className="flex flex-col w-full h-screen">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center">
        {onBack && (
          <button
            className="btn btn-sm btn-ghost text-white mr-2"
            onClick={onBack}
          >
            ←
          </button>
        )}
        <div className="font-semibold">
          {name} ({wa_id})
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-base-100">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat ${msg.name === "You" ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-header">{msg.name}</div>
            <div
              className={`chat-bubble ${
                msg.name === "You"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
              {msg.name === "You" && (
                <span className="ml-2 inline-flex items-center">
                  {msg.status === "sent" && <CheckIcon />}
                  {msg.status === "delivered" && (
                    <CheckDoubleIcon color="gray" />
                  )}
                  {msg.status === "read" && <CheckDoubleIcon color="blue" />}
                </span>
              )}
            </div>
            <div className="chat-footer opacity-50 text-xs">
              {new Date(msg.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-2 flex items-center gap-2 bg-base-200">
        <input
          className="input input-bordered w-full"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
