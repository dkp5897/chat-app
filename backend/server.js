const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const userRouter = require("./routes/userRoute");
const chatRoutes = require("./routes/chatRoutes");
const messageRoute = require('./routes/messageRoute')
const errorMidleware = require("./middleware/error");


const connectDataBase = require("./config/db");

//config
const app = express();
app.use(express.json()); //to accept json data fron frontend

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT,DELETE");
  next();
});

app.use("/api/user", userRouter);
app.use("/api/chats", chatRoutes);
app.use("/api/message",messageRoute)

app.use(errorMidleware);


const server = app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`);
});

app.get("/", (req, res) => {
    res.send("API is running..");
  });



// socket connection

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});
io.on("connection", (socket) => {
  // console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  });

  //for connecting sender and reciever in same room
  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
    // console.log("socket connected to room: " + chatId);
  });

  //for showing typing and  stop typing

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  //for instant recieving the messgaes
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not define");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return; // if i send a msg, it should not recieve back to me

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup",()=>{
    console.log("user Disconnected")
    socket.leave(userData._id)
  })
})

connectDataBase()
