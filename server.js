const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins, adjust this as per your requirements
  },
});

let users = [];

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('join', (user) => {
    users.push({ socketId: socket.id, ...user });
    io.emit('updateUsers', users);
  });

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat ${chatId}`);
  });

  socket.on('sendMessage', (message) => {
    const { chatId, recipient } = message;
    const recipientSocket = users.find(user => user.email === recipient)?.socketId;
    if (recipientSocket) {
      io.to(recipientSocket).emit('receiveMessage', message);
    }
  });
  

  socket.on('disconnect', () => {
    users = users.filter(user => user.socketId !== socket.id);
    io.emit('updateUsers', users);
    console.log('Client disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
