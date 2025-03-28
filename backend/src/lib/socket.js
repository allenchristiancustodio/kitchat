import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5175",
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//use to store online users
export const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // socket.on("typing", (receiverId) => {
  //   const receiverSocketId = getReceiverSocketId(receiverId);
  //   if (receiverSocketId) {
  //     io.to(receiverSocketId).emit("userTyping", socket.userId);
  //   }
  // });

  // socket.on("stopTyping", (receiverId) => {
  //   const receiverSocketId = getReceiverSocketId(receiverId);
  //   if (receiverSocketId) {
  //     io.to(receiverSocketId).emit("userStoppedTyping", socket.userId);
  //   }
  // });
});

export { io, app, server };
