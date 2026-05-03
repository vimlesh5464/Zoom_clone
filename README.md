# 🎥 Zoom Clone - Full Stack Real-Time Video Conferencing App

A full-stack real-time video conferencing application inspired by Zoom.  
It supports authentication, meeting rooms, and peer-to-peer video/audio communication using WebRTC and WebSockets.

---

## 🚀 Features

- 🔐 User Authentication (JWT-based)
- 🎥 Real-time Video & Audio Calling (WebRTC)
- 💬 WebSocket-based signaling system
- 👥 Meeting rooms (join / leave system)
- 🧑‍💻 Protected routes in frontend
- 📊 Modular backend architecture
- ⚡ Low-latency peer-to-peer communication

---

## 🏗️ Tech Stack

### Frontend
- React.js (Vite)
- Context API (State Management)
- Axios (API calls)
- CSS Modules

### Backend
- FastAPI (Python) / Node.js (modular structure)
- WebSockets
- JWT Authentication
- Pydantic (Schema validation)

### Real-Time Communication
- WebRTC (Peer-to-peer video/audio)
- WebSockets (Signaling server)

### Database
- PostgreSQL ,sqlalchemy

---

## 📁 Project Structure

### Backend
backend/
└── app/
├── main.py
├── config.py
├── db/
├── routes/
├── services/
├── schemas/
├── dependencies/
├── utils/
└── websocket/


### Frontend

frontend/
└── src/
├── pages/
├── contexts/
├── services/
├── utils/
├── styles/
├── assets/
├── App.jsx
└── main.jsx




---

## ⚙️ How It Works

### 1. Authentication
- User registers/logs in
- Backend returns JWT token
- Token is stored in frontend context

### 2. Join Meeting
- User enters meeting room
- Connects to WebSocket server
- Joins a specific room

### 3. Signaling (WebSocket)
- Exchange of:
  - Offer (SDP)
  - Answer (SDP)
  - ICE candidates

### 4. WebRTC Connection
- Peer-to-peer connection is established
- Audio/video stream flows directly between users

---

## 🔐 Authentication Flow

1. User logs in
2. Backend validates credentials
3. JWT token generated
4. Token used for protected routes & WebSocket auth

---

## 🎥 WebRTC Architecture

- WebSocket → Signaling only
- WebRTC → Actual media streaming (P2P)


User A ↔ WebSocket ↔ Server ↔ WebSocket ↔ User B
(Signaling)

User A ↔──── WebRTC P2P ────↔ User B
(Video/Audio Stream)


---

## ⚡ Limitations

- Not optimized for large group calls
- Depends on peer-to-peer connectivity
- Requires STUN/TURN servers for NAT traversal
- No SFU/MCU architecture implemented

---

## 🚀 Future Improvements

- Add SFU server for scalable group calls
- Screen sharing feature
- Chat system inside meetings
- Recording functionality
- Mobile responsiveness improvements

---

## 👨‍💻 Author

**Vimlesh Gupta**  
B.Tech CSE Student | Full Stack Developer  

---

## 📌 Learning Outcomes

- Real-time system design
- WebRTC & WebSocket integration
- Full-stack architecture design
- Authentication & security (JWT)
- Scalable backend structuring

---

## ⭐ If you like this project

Give it a star ⭐ and feel free to contribute!