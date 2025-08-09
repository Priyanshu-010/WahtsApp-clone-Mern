import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatWindow from './ChatWindow';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
  transports: ['websocket', 'polling']
});

export default function Layout() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/messages/conversations`)
      .then(res => setChats(Object.entries(res.data)))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    socket.on('new-message', msg => {
      setChats(prev => {
        const updated = { ...Object.fromEntries(prev) };
        if (!updated[msg.wa_id]) updated[msg.wa_id] = [];
        updated[msg.wa_id].push(msg);
        return Object.entries(updated);
      });
    });

    socket.on('message-status-update', updatedMsg => {
      setChats(prev => {
        const updated = { ...Object.fromEntries(prev) };
        if (updated[updatedMsg.wa_id]) {
          updated[updatedMsg.wa_id] = updated[updatedMsg.wa_id].map(m =>
            m._id === updatedMsg._id ? updatedMsg : m
          );
        }
        return Object.entries(updated);
      });
    });

    return () => {
      socket.off('new-message');
      socket.off('message-status-update');
    };
  }, []);

  const filteredChats = chats.filter(([wa_id, messages]) => {
    const lastMsg = messages[messages.length - 1] || {};
    return (
      wa_id.includes(search) ||
      lastMsg.name?.toLowerCase().includes(search.toLowerCase()) ||
      lastMsg.text?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="h-screen flex bg-base-100">
      {/* Sidebar */}
      <div
        className={`border-r bg-base-200 w-full md:w-1/3 flex flex-col ${
          activeChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="bg-green-600 text-white p-4 font-bold">WhatsApp Clone</div>
        <div className="p-2">
          <input
            className="input input-bordered w-full"
            placeholder="Search or start new chat"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-y-auto flex-1">
          {filteredChats.length > 0 ? (
            filteredChats.map(([wa_id, messages]) => {
              const lastMsg = messages[messages.length - 1] || {};
              return (
                <div
                  key={wa_id}
                  onClick={() => setActiveChat({ wa_id, name: lastMsg.name })}
                  className={`p-4 cursor-pointer hover:bg-base-300 border-b ${
                    activeChat?.wa_id === wa_id ? 'bg-base-300' : ''
                  }`}
                >
                  <div className="font-semibold">{lastMsg.name || wa_id}</div>
                  <div className="text-sm opacity-70 truncate">{lastMsg.text}</div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-gray-500 text-center">No chats found</div>
          )}
        </div>
      </div>

      {/* Desktop chat view */}
      <div className="hidden md:flex flex-1">
        {activeChat ? (
          <ChatWindow socket={socket} wa_id={activeChat.wa_id} name={activeChat.name} />
        ) : (
          <div className="flex items-center justify-center w-full text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>

      {/* Mobile chat view */}
      {activeChat && (
        <div className="flex md:hidden flex-1">
          <ChatWindow
            socket={socket}
            wa_id={activeChat.wa_id}
            name={activeChat.name}
            onBack={() => setActiveChat(null)}
          />
        </div>
      )}
    </div>
  );
}
