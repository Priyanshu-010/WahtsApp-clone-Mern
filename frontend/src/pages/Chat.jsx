import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Chat({ wa_id, name, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = io(API_BASE);

  useEffect(() => {
    axios.get(`${API_BASE}/api/messages/${wa_id}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));

    socket.on('receiveMessage', (message) => {
      if (message.wa_id === wa_id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => socket.disconnect();
  }, [wa_id]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    axios.post(`${API_BASE}/api/messages/send`, {
      wa_id,
      text: newMessage,
    })
      .then((res) => {
        setMessages((prev) => [...prev, res.data]);
        setNewMessage('');
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-4 bg-base-300 border-b">
        {/* Back button only on mobile */}
        {onBack && (
          <button
            className="btn btn-sm btn-ghost mr-2 md:hidden"
            onClick={onBack}
          >
            ←
          </button>
        )}
        <h2 className="font-semibold">{name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat ${msg.isSentByUser ? 'chat-end' : 'chat-start'}`}
          >
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
