import { useState, useEffect } from 'react';
import axios from 'axios';
import Chat from './Chat';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/api/messages/conversations`)
      .then(res => setConversations(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="h-screen flex bg-base-100">
      {/* Sidebar */}
      <div
        className={`border-r bg-base-200 w-full md:w-1/3 flex flex-col overflow-y-auto ${
          activeChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        <h2 className="p-4 text-lg font-bold border-b">Chats</h2>
        {conversations.map((conv) => (
          <div
            key={conv.wa_id}
            className="p-4 cursor-pointer hover:bg-base-300"
            onClick={() => setActiveChat(conv)}
          >
            <p className="font-semibold">{conv.name}</p>
            <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <Chat
            wa_id={activeChat.wa_id}
            name={activeChat.name}
            onBack={() => setActiveChat(null)}
          />
        ) : (
          <div className="hidden md:flex items-center justify-center w-full text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
