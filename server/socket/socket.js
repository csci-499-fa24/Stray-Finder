const socketio = require('socket.io');
const Message = require('../models/message');

module.exports = (server) => {
    const io = socketio(server);

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
    
        // Join a room for each user (based on user ID)
        socket.on('joinRoom', (userId) => {
            socket.join(userId); // Create/Join a room with the userId
            console.log(`User with ID ${userId} joined their room`);
        });

        socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
            try {
                // Save the message in the database
                const newMessage = new Message({
                    sender: senderId,
                    receiver: receiverId,
                    message: message,
                    delivered: false,
                    timestamp: new Date(),
                });
                await newMessage.save();
            
                const receiverSocket = io.sockets.adapter.rooms.get(receiverId);

                if (receiverSocket) {
                    // Receiver is online, send the message immediately
                    io.to(receiverId).emit('receiveMessage', {
                        sender: senderId,
                        message: message,
                        timestamp: newMessage.timestamp,
                    });
                }
            } catch (error) {
                console.error("Error saving or sending message:", error);
            }
        });

        // Fetch and load previous messages for a conversation
        socket.on('getMessages', async ({ userId, otherUserId }) => {
            try {
            // Find all messages between the two users
            const messages = await Message.find({
                $or: [
                    { sender: userId, receiver: otherUserId },
                    { sender: otherUserId, receiver: userId }
                ]
            }).sort({ timestamp: 1 }); // Sort messages by timestamp

            // Mark unread messages as read if the user is the receiver
            await Message.updateMany(
                { receiver: userId, sender: otherUserId, delivered: false },
                { $set: { delivered: true } }
            );

            // Send the conversation history to the client
            socket.emit('loadMessages', messages);
            } catch (error) {
                console.error("Error loading messages:", error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};