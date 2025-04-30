const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const waitingUsers = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // When user clicks "Start"
  socket.on("find-match", () => {
    if (waitingUsers.length > 0) {
      const peerId = waitingUsers.pop();
      io.to(peerId).emit("match-found", socket.id);
      socket.emit("match-found", peerId);
      console.log(`Matched ${socket.id} with ${peerId}`);
    } else {
      waitingUsers.push(socket.id);
      console.log(`Added ${socket.id} to waiting pool`);
    }
  });

  // WebRTC signaling relay
  socket.on("signal", ({ to, data }) => {
    io.to(to).emit("signal", { from: socket.id, data });
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    const index = waitingUsers.indexOf(socket.id);
    if (index !== -1) waitingUsers.splice(index, 1);
    console.log("User disconnected:", socket.id);
  });
});

// Start server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
