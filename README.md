# 🚀 CodeVance

> Real-time collaborative coding platform for developers.

CodeVance is a modern collaborative coding environment that enables developers to write code together in real time, communicate through integrated chat, and execute code in multiple programming languages.

Built with React, Vite, Monaco Editor, Socket.IO, and Tailwind CSS.

---

## ✨ Features

### 🔐 Authentication
- User Registration
- User Login
- JWT-based Authentication
- Protected Routes
- Secure Cookie Sessions

### 💻 Real-Time Collaborative Editor
- Room-based collaboration
- Live code synchronization
- Monaco Editor integration
- Multi-user editing

### 💬 Real-Time Chat
- Room-specific chat
- Instant message delivery
- Live collaboration experience

### ⚡ Code Execution
Supports multiple languages:

- JavaScript
- Python
- Java
- C
- C++

Powered by Judge0 API.

### 🎨 Modern UI
- Responsive Design
- Dark Theme
- Glassmorphism Inspired Layout
- Mobile Friendly
- Developer-Focused Experience

---

## 🏗️ Architecture

```text
Frontend (CodeVance)
       │
       ├── Authentication API
       │
       ├── Code Execution API
       │
       ▼
Backend Service

Frontend (CodeVance)
       │
       ▼
Socket.IO Server
       │
       ├── Room Management
       ├── Live Chat
       └── Code Synchronization
```

---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client
- Monaco Editor
- React Hot Toast

### Backend Services

- Node.js
- Express.js
- MongoDB Atlas
- Socket.IO
- JWT Authentication

---

## 📂 Project Structure

```text
src/
│
├── auth/
├── components/
├── config/
├── pages/
├── assets/
├── App.jsx
└── main.jsx
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://your-backend-url/api
VITE_SOCKET_URL=https://your-socket-server-url
```

---

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/Lakshman76/CodeVance
```

Move into the project:

```bash
cd codevance
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## 🌐 Live Demo

Frontend:

[CodeVance Live Demo](https://codevance-laksh.vercel.app)

---

## 🔗 Related Repositories

### Frontend
CodeVance (Current)

### Backend API
[CodeVance-backend](https://github.com/Lakshman76/CodeVance-backend)

### Code Editor | Socket Server
[CodeVance-code-editor](https://github.com/Lakshman76/CodeVance-code-editor)

---

## 🚧 Upcoming Features

- 📹 Video Calling
- 🎤 Audio Calling
- 🖥️ Screen Sharing
- 👥 Active Participants Panel
- 📁 Collaborative File Explorer
- 🧠 AI Coding Assistant

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit a pull request.

---

## 👨‍💻 Author

Lakshman Kumar

[Github](https://github.com/Lakshman76)

---

## ⭐ Support

If you found this project useful, consider giving it a star.
