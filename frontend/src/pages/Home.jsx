import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [chats, setChats] = useState([]);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API_BASE || 'http://localhost:3000'}/api/messages/conversations`)
      .then(res => setChats(Object.entries(res.data)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chats</h1>
      <div className="grid gap-2">
        {chats.map(([wa_id, messages]) => {
          const lastMsg = messages[messages.length - 1];
          return (
            <Link
              key={wa_id}
              to={`/chat/${wa_id}`}
              className="p-4 rounded-xl bg-base-200 hover:bg-base-300 transition"
            >
              <div className="font-semibold">{lastMsg.name} ({wa_id})</div>
              <div className="text-sm opacity-70 truncate">{lastMsg.text}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
