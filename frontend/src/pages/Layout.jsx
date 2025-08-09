import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatWindow from './ChatWindow';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');

export default function Layout() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  // Fetch conversations
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/messages/conversations`)
      .then(res => setChats(Object.entries(res.data)))
      .catch(err => console.error(err));
  }, []);

  // Update real-time
  useEffect(() => {
    socket.on('new-message', msg => {
      setChats(prev => {
        const updated = { ...Object.fromEntries(prev) };
        if (!updated[msg.wa_id]) updated[msg.wa_id] = [];
        updated[msg.wa_id].push(msg);
        return Object.entries(updated);
      });
    });
    return () => socket.off('new-message');
  }, []);

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className={`border-r bg-base-200 w-full md:w-1/3 flex flex-col`}>
        <div className="bg-green-600 text-white p-4 font-bold">WhatsApp Clone</div>
        <div className="p-2">
          <input
            className="input input-bordered w-full"
            placeholder="Search or start new chat"
          />
        </div>
        <div className="overflow-y-auto flex-1">
          {chats.map(([wa_id, messages]) => {
            const lastMsg = messages[messages.length - 1];
            return (
              <div
                key={wa_id}
                onClick={() => setActiveChat({ wa_id, name: lastMsg.name })}
                className={`p-4 cursor-pointer hover:bg-base-300 ${activeChat?.wa_id === wa_id ? 'bg-base-300' : ''}`}
              >
                <div className="font-semibold">{lastMsg.name} ({wa_id})</div>
                <div className="text-sm opacity-70 truncate">{lastMsg.text}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Window */}
      <div className="hidden md:flex flex-1">
        {activeChat ? (
          <ChatWindow wa_id={activeChat.wa_id} name={activeChat.name} />
        ) : (
          <div className="flex items-center justify-center w-full text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>

      {/* Mobile view */}
      {activeChat && (
        <div className="flex md:hidden flex-1">
          <ChatWindow wa_id={activeChat.wa_id} name={activeChat.name} onBack={() => setActiveChat(null)} />
        </div>
      )}
    </div>
  );
}
