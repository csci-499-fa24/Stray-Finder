const Message = require('../models/message');
const User = require('../models/user');
const express = require('express');
const app = express();

app.use(express.json());


const sendMessage = async (req, res) => {
    const { content } = req.body;
    const recipientId = req.params.recipientId;
    if (!recipientId || !content) {
        return res.status(400).json({ message: 'Receiver and content are required' });
    }

    try {
        const message = new Message({
            senderId: req.user._id,
            recipientId,
            content,
        });
        await message.save();
        return res.status(201).json(message);

    } catch (error) {
        return res.status(500).json({ message: 'failed to send message ', error: error.message });
    }
};

const getMessages = async (req, res) => {
    const { otherUserId } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.user._id, recipientId: otherUserId },
                { senderId: otherUserId, recipientId: req.user._id}
            ],
        }).sort({ timestamp: 1 });
        return res.status(200).json(messages);

    } catch(error) {
        return res.status(500).json({ message: 'Failed to get messages ', error: error.message });
    }
};

const retrieveAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        
        // Step 1: Find all messages where the current user is the sender or recipient
        const messages = await Message.find({
            $or: [{ senderId: currentUserId }, { recipientId: currentUserId }]
        }).sort({ timestamp: -1 }); // Sort messages by timestamp in descending order

        // Step 2: Collect the latest message content for each unique user ID involved in the messages (excluding the current user)
        const userMessages = {};
        messages.forEach((message) => {
            const otherUserId = message.senderId.toString() === currentUserId.toString()
                ? message.recipientId.toString()
                : message.senderId.toString();
            
            // Only store the first (latest) message per user
            if (!userMessages[otherUserId]) {
                userMessages[otherUserId] = message.content;
            }
        });

        // Step 3: Retrieve the user information (id, username, and last message) for these user IDs
        const userIds = Object.keys(userMessages);
        const users = await User.find({ _id: { $in: userIds } }, 'username');
        const userInfo = users.map(user => ({
            id: user._id,
            username: user.username,
            lastMessage: userMessages[user._id.toString()]
        }));

        // Return the list of userInfo objects
        return res.status(200).json(userInfo);
    } catch (error) {
        console.error('Error retrieving users:', error);
        return res.status(500).json({ message: 'Error retrieving users' });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    retrieveAllUsers
};