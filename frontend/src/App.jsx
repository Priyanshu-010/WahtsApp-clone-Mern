import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
    </Routes>
  );
}
