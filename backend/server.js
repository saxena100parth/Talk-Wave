const express = require("express");
const colors = require("colors");
const env = require("dotenv");
const chat = require("./data/chats");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const path = require("path");

const PORT = process.env.PORT || 5000;

env.config();
connectDB();

const app = express();
app.use(express.json()); // to accept the json data

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
// -----------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname1, "../frontend", "build", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}
// -----------------  //
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.blue.bold);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log("joined room", userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("joined room", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("disconnected from socket.io");
    socket.leave(userData._id);
  });
});
