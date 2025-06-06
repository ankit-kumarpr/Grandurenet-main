const http = require("http");
const app = require("./app");
const dotenv = require("dotenv");
const port = process.env.PORT || 3000;
const ChatMessage = require("./Models/ChatMessage");

const server = http.createServer(app);

// Socket.IO setup
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins a chat session
  socket.on("joinSession", ({ sessionId, userId }) => {
    console.log("in server", sessionId,userId);
    socket.join(sessionId);
    socket.userId = userId;
    socket.sessionId = sessionId;
    
    onlineUsers.set(userId, socket.id);
    io.to(sessionId).emit('onlineUsers', Array.from(onlineUsers.keys()));
    
    console.log(`User ${userId} joined session ${sessionId}`);
  });

  // Handle chat messages
  socket.on("sendMessage", async ({ sessionId, userId, message }) => {
    try {
      const chatMsg = new ChatMessage({
        session: sessionId,
        sender: userId,
        message,
      });
      
      await chatMsg.save();

      // Populate sender info before sending
      const populatedMsg = await ChatMessage.findById(chatMsg._id)
        .populate('sender', 'name email')
        .lean();

      // Broadcast message to everyone in the session including sender
      io.to(sessionId).emit("receiveMessage", {
        _id: populatedMsg._id,
        session: populatedMsg.session,
        message: populatedMsg.message,
        sentAt: populatedMsg.sentAt,
        sender: {
          _id: populatedMsg.sender._id,
          name: populatedMsg.sender.name,
          email: populatedMsg.sender.email
        }
      });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      if (socket.sessionId) {
        io.to(socket.sessionId).emit('onlineUsers', Array.from(onlineUsers.keys()));
      }
    }
    console.log("User disconnected:", socket.id);
  });
});


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
