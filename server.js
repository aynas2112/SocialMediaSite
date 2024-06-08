const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const users = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (data) => {
    const { email, firstname } = data;
    users.push({ socketId: socket.id, email, firstname });
    console.log(`${firstname} joined with email ${email} and socket ID ${socket.id}`);
  });

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat room ${chatId}`);
  });

  socket.on('sendMessage', (message) => {
    console.log(`Sending message to chat room ${message.chatId} and receiver ${message.receiver}:`, message);
    const receiver = users.find(user => user.email === message.receiver);
    if (receiver) {
      console.log(`Message being sent to: ${receiver.email}`); // Add this line to log the email ID
      io.to(receiver.socketId).emit('receiveMessage', message);
      console.log(`Message sent to ${message.receiver}:`, message);
    }
    io.to(message.chatId).emit('receiveMessage', message);
    console.log(`Message broadcasted to chat room ${message.chatId}`);
  });
  

  socket.on('disconnect', () => {
    const index = users.findIndex(user => user.socketId === socket.id);
    if (index !== -1) {
      const disconnectedUser = users.splice(index, 1)[0];
      console.log(`${disconnectedUser.firstname} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
