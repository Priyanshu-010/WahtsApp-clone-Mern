import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat/:wa_id" element={<Chat />} />
    </Routes>
  );
}
