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
  
    // Find the receiver's socket ID
    const receiver = users.find(user => user.email === message.receiver);
    if (receiver) {
      console.log(`Receiver's socket ID: ${receiver.socketId}`);
      io.to(receiver.socketId).emit('receiveMessage', message);
      console.log(`Message sent to ${message.receiver}:`, message);
    } else {
      console.log(`Receiver not found for message:`, message);
    }
  
    // Print the sender's socket ID
    console.log(`Sender's socket ID: ${socket.id}`);
  
    // Broadcast the message to all users in the chat room except the sender
    socket.to(message.chatId).emit('receiveMessage', message);
  
    console.log(`Message broadcasted to chat room ${message.chatId}`);
  });
  
  
  // On the server
  socket.on('messageReceived', (data) => {
    // `data` contains the message details and receiver's acknowledgment
    const { message, receiverSocketId } = data;

    // Notify the sender that the message has been delivered
    const sender = users.find(user => user.email === message.sender);
    if (sender) {
      io.to(sender.socketId).emit('messageDelivered', message);
    }
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
