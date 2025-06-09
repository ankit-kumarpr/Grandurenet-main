const http = require("http");
const app = require("./app");
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

  // User joins a chat room
  socket.on("joinSession", ({ roomId, userId }) => {
    console.log("User joined room:", roomId, userId);
    socket.join(roomId);
    socket.userId = userId;
    socket.roomId = roomId;

    onlineUsers.set(userId, socket.id);
    io.to(roomId).emit("onlineUsers", Array.from(onlineUsers.keys()));

    console.log(`User ${userId} joined room ${roomId}`);
  });

  // Handle sending a chat message
  socket.on("sendMessage", async ({ message }) => {
    const roomId = socket.roomId;
    const userId = socket.userId;

    if (!roomId || !userId) {
      console.error("Missing roomId or userId for socket:", socket.id);
      return;
    }

    console.log("Sending message to roomId:", roomId);
    console.log("From userId:", userId);
    console.log("Message content:", message);

    try {
      const chatMsg = new ChatMessage({
        room: roomId,
        sender: userId,
        message,
      });

      const response = await chatMsg.save();
      console.log("Message saved:", response);

      const populatedMsg = await ChatMessage.findById(chatMsg._id)
        .populate("sender", "name email")
        .lean();

      io.to(roomId).emit("receiveMessage", {
        _id: populatedMsg._id,
        room: populatedMsg.room,
        message: populatedMsg.message,
        sentAt: populatedMsg.sentAt,
        sender: {
          _id: populatedMsg.sender._id,
          name: populatedMsg.sender.name,
          email: populatedMsg.sender.email,
        },
      });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // WebRTC Audio Call - Offer
  socket.on("audio-offer", ({ roomId, offer, senderId }) => {
    console.log(`Audio Offer from ${senderId} to room ${roomId}`);
    socket.to(roomId).emit("audio-offer", { offer, senderId });
  });

  // WebRTC Audio Call - Answer
  socket.on("audio-answer", ({ roomId, answer, senderId }) => {
    console.log(`Audio Answer from ${senderId} to room ${roomId}`);
    socket.to(roomId).emit("audio-answer", { answer, senderId });
  });

  // WebRTC ICE Candidate
  socket.on("audio-ice-candidate", ({ roomId, candidate, senderId }) => {
    console.log(`ICE Candidate from ${senderId} in room ${roomId}`);
    socket.to(roomId).emit("audio-ice-candidate", { candidate, senderId });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      if (socket.roomId) {
        io.to(socket.roomId).emit("onlineUsers", Array.from(onlineUsers.keys()));
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
