const socketio = require('socket.io');
const Message = require('../models/message');

module.exports = (server) => {
    const io = socketio(server, {
        cors: {
            origin: process.env.NEXT_PUBLIC_CLIENT_URL,
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('userConnected', (userId) => {
            connectedUsers[userId] = socket.id;
            console.log(`User ${userId} connected with socket ID: ${socket.id}`);
        });

        // Listen for sendMessage event
        socket.on('sendMessage', ({ senderId, recipientId, content }) => {
            console.log('Message received:', { senderId, recipientId, content});
            saveMessage(senderId, recipientId, content);
        });

        // Handle user disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

// Function to save messages in the database
const saveMessage = async (senderId, recipientId, content) => {
    const message = new Message({
        senderId,
        recipientId,
        content,
    });
    await message.save();
};