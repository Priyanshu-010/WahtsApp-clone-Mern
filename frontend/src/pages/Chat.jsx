import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Chat() {
  const { wa_id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3000/api/messages/${wa_id}`)
      .then(res => setMessages(res.data));

    socket.on('new-message', msg => {
      if (msg.wa_id === wa_id) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => socket.off('new-message');
  }, [wa_id]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const res = await axios.post('http://localhost:3000/api/messages/send', {
      wa_id,
      name: "You",
      text: input
    });
    setInput('');
  };

  return (
    <div className="p-4 flex flex-col h-screen">
      <h2 className="text-xl font-bold mb-2">Chat with {wa_id}</h2>
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat ${msg.name === "You" ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-header">{msg.name}</div>
            <div className="chat-bubble">{msg.text}</div>
            <div className="chat-footer opacity-50 text-xs">
              {msg.status} | {new Date(msg.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          className="input input-bordered w-full"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
