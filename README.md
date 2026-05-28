# Talent-IQ

A real-time technical interview platform built for developers to conduct live coding interviews with integrated video calls, collaborative coding, and automated code execution.

## 🚀 Features

* Real-time 1-on-1 interview rooms
* Monaco Editor (VSCode-powered)
* Multi-language code execution using Judge0 API
* Video calling with Stream Video
* Room locking system (only 2 participants allowed)
* Authentication using Clerk
* Event-driven background jobs using Inngest
* Real-time communication with Stream

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB

### Services & APIs

* Clerk Authentication
* Stream Video SDK
* Judge0 API
* Inngest


## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/RishavRaj108/talent-IQ.git

# Move into project directory
cd talent-IQ

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in both frontend and backend directories.

Example:

```env
MONGODB_URI=
CLERK_SECRET_KEY=
VITE_CLERK_PUBLISHABLE_KEY=
STREAM_API_KEY=
STREAM_SECRET=
JUDGE0_API_KEY=
```

---

## ▶️ Run Locally

```bash
# Frontend
npm run dev

# Backend
npm run start
```

---

## 🌐 Live Demo

https://talent-iq-jlb6.onrender.com

---

## 📚 What I Learned

* Managing real-time systems
* Building scalable event-driven workflows with Inngest
* Integrating third-party APIs securely
* Handling synchronized state across multiple services

---

## 👨‍💻 Author

Rishav Raj

* GitHub: https://github.com/RishavRaj108
* Portfolio: https://rishavraj.space
