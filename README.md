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
- `POST /api/user/signUp` - Register a new user
- `POST /api/user/login` - User login
- `GET /api/user?search=query` - Search/get all users

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

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,           // User's display name
  email: String,          // Unique email address
  password: String,       // Hashed password
  pic: String,           // Profile picture URL
  timestamps: true       // createdAt, updatedAt
}
```

### Chat Model
```javascript
{
  chatName: String,       // Chat/Group name
  isGroupChat: Boolean,   // false for 1-on-1, true for groups
  users: [ObjectId],      // Array of user references
  latestMessage: ObjectId, // Reference to latest message
  groupAdmin: ObjectId,   // Reference to group admin (for groups)
  timestamps: true       // createdAt, updatedAt
}
```

### Message Model
```javascript
{
  sender: ObjectId,       // Reference to sender user
  content: String,        // Message text content
  chat: ObjectId,         // Reference to chat/group
  timestamps: true       // createdAt, updatedAt
}
```

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

## 📱 Usage

### Getting Started
1. **Register/Login**: Create a new account or login with existing credentials
2. **Search Users**: Use the search functionality to find other users
3. **Start Chatting**: Click on a user to start a one-on-one conversation
4. **Create Groups**: Use the group chat feature to create group conversations
5. **Manage Groups**: Add/remove users and rename groups (admin only)

### Key Features in Action
- **Real-time messaging**: Messages appear instantly without page refresh
- **Typing indicators**: See "User is typing..." when someone is composing a message
- **Online status**: See which users are currently online
- **Message persistence**: All chat history is saved and loads when you revisit

## 🔧 Development

### Running in Development Mode

**Backend (with auto-restart)**
```bash
npm run server  # Uses nodemon for auto-restart on changes
```

**Frontend (with hot reload)**
```bash
cd frontend
npm start  # React development server with hot reload
```

### Building for Production

**Frontend Build**
```bash
cd frontend
npm run build
```

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

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
- Check if MongoDB is running and accessible
- Verify environment variables in `.env` file
- Ensure PORT is not already in use

**Frontend can't connect to backend**
- Verify backend server is running on correct port
- Check CORS configuration in `server.js`
- Ensure API endpoints match between frontend and backend

**Socket.io connection issues**
- Check network connectivity
- Verify Socket.io server configuration
- Ensure frontend is connecting to correct backend URL

**Database connection errors**
- Verify MongoDB connection string
- Check database permissions
- Ensure MongoDB service is running

## 📦 Dependencies

### Backend Dependencies
- `express` - Web application framework
- `mongoose` - MongoDB ODM
- `socket.io` - Real-time communication
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `dotenv` - Environment variables
- `express-async-handler` - Async error handling
- `body-parser` - Request body parsing

### Frontend Dependencies
- `react` & `react-dom` - React library
- `@chakra-ui/react` - UI component library
- `@chakra-ui/icons` - Icon components
- `socket.io-client` - Socket.io client
- `react-router-dom` - Routing
- `axios` - HTTP client
- `framer-motion` - Animation library
- `react-lottie-player` - Lottie animations
- `react-notification-badge` - Notification badges
- `react-scrollable-feed` - Auto-scrolling feed

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
