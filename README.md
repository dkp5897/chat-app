# Air-Talk 💬

A modern, real-time chat application built with React and Node.js that enables seamless communication through both one-on-one and group conversations.

## 🌟 Features

- **Real-time Messaging**: Instant messaging using Socket.io
- **User Authentication**: Secure signup/login with JWT tokens
- **One-on-One Chats**: Private conversations between users
- **Group Chats**: Create and manage group conversations
- **Group Management**: Add/remove users, rename groups, group admin privileges
- **Typing Indicators**: See when others are typing
- **Message History**: Persistent chat history stored in database
- **Profile Pictures**: Custom user avatars
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Notifications**: Get notified of new messages instantly

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **Chakra UI** - Simple, modular and accessible component library
- **Socket.io Client** - Real-time bidirectional event-based communication
- **React Router DOM** - Declarative routing for React
- **Axios** - Promise-based HTTP client
- **Framer Motion** - Production-ready motion library for React

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **Socket.io** - Real-time communication library
- **MongoDB** - NoSQL database for storing user data and messages
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT (JSON Web Tokens)** - Secure user authentication
- **bcryptjs** - Password hashing library

## 🏗️ Project Structure

```
chat-app/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── Chat/        # Chat-related components
│   │   │   ├── UserBoxes/   # User interface components
│   │   │   ├── authentication/ # Login/signup components
│   │   │   ├── messagesBox/ # Message display components
│   │   │   ├── miscellaneous/ # Utility components
│   │   │   └── protectedRoute/ # Route protection
│   │   ├── pages/           # Main page components
│   │   ├── context/         # React context for state management
│   │   └── App.js           # Main application component
│   └── package.json
├── backend/                 # Node.js backend server
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose data models
│   ├── routes/             # API route definitions
│   └── server.js           # Main server file
├── package.json            # Root package.json for deployment
└── vercel.json             # Vercel deployment configuration
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/dkp5897/chat-app.git
cd chat-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**
Create a `.env` file in the backend directory with:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. **Start the backend server**
```bash
npm run server
# or for production
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication Routes (`/api/user`)
- `POST /api/user/signup` - Register a new user
- `POST /api/user/login` - User login
- `GET /api/user/search?search=query` - Search users

### Chat Routes (`/api/chats`)
- `POST /api/chats/userChat` - Create/fetch one-on-one chat
- `GET /api/chats/userChat` - Get all user chats
- `POST /api/chats/groupChat` - Create group chat
- `PUT /api/chats/rename` - Rename group chat
- `PUT /api/chats/adduser` - Add user to group
- `PUT /api/chats/removeuser` - Remove user from group

### Message Routes (`/api/message`)
- `POST /api/message/new` - Send new message
- `GET /api/message/:chatId` - Get all messages for a chat

## 🔌 Socket.io Events

### Client → Server
- `setup` - Initialize user socket connection
- `join-chat` - Join a specific chat room
- `typing` - Emit typing status
- `stop typing` - Stop typing status
- `new message` - Send new message

### Server → Client
- `connected` - Confirm socket connection
- `typing` - Receive typing notification
- `stop typing` - Stop typing notification
- `message received` - Receive new message

## 🚀 Deployment

### Backend (Vercel)
The backend is configured for deployment on Vercel:
- Uses `vercel.json` configuration
- Automatic deployments from main branch
- Environment variables configured in Vercel dashboard

### Frontend (Netlify)
The frontend is deployed on Netlify:
- Build command: `npm run build`
- Publish directory: `build`
- Automatic deployments from main branch

**Live Demo**: [Air-Talk on Netlify](https://air-talk.netlify.app)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**DKP5897** - [GitHub Profile](https://github.com/dkp5897)

---

⭐ Star this repo if you find it helpful!
