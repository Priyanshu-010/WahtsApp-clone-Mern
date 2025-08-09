# WhatsApp Web Clone – RapidQuest Full Stack Developer Assignment

This is a **full-stack MERN application** that simulates WhatsApp Web for testing and demonstration purposes.  
It processes **webhook payloads** (sample JSON files) to display chats, messages, and statuses in a WhatsApp-like interface.  
Messages can be sent from the UI, saved in MongoDB, and updated in **real-time** via WebSocket (Socket.IO).

---

## 🚀 Features
- **Webhook Payload Processing** – Reads `.json` files from `/backend/payloads` and stores them in MongoDB
- **WhatsApp Web–like UI** – Responsive, mobile-friendly, and styled with Tailwind CSS + DaisyUI
- **Conversations View** – Groups chats by user (`wa_id`) with last message preview
- **Message View** – Shows all messages in a chat with date, time, and status ticks
- **Send Message Simulation** – Messages are stored in DB and shown in real-time (no real WhatsApp API calls)
- **Status Updates** – Sent → Delivered → Read ticks update automatically
- **Real-Time Interface** – New messages and status changes appear instantly without refreshing

---

## 🛠 Tech Stack
**Frontend:**
- React 19
- Vite
- Tailwind CSS v4.1 + DaisyUI v5
- Socket.IO Client
- Axios
- React Router v7

**Backend:**
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- Socket.IO
- dotenv

---

## 📂 Project Structure

Whatsapp-Clone/
├── backend/
│ ├── server.js
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── utils/
│ ├── payloads/ # JSON webhook files
│ └── processPayloads.js
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── utils/
│ │ ├── App.jsx/
│ │ ├── index.css
│ │ └── main.jsx
│ └── vite.config.js


---

## 📦 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone <repo-url>
cd whatsapp-clone

2️⃣ Setup Backend

cd backend
npm install

Create .env file:

PORT=3000
MONGO_URI=your-mongodb-atlas-uri

npm run dev

3️⃣ Setup Frontend

cd frontend
npm install

Create .env file:

VITE_API_URL=http://localhost:3000

npm run dev

📝 Processing Webhook Payloads
Place sample payload .json files in:

backend/payloads/

Run:
cd backend
node processPayloads.js

