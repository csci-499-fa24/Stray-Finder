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

        await Message.updateMany(
            { senderId: otherUserId, recipientId: req.user._id, delivered: false },
            { $set: { delivered: true } }
        );
        
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
        });

        // Step 2: Collect the unique user IDs involved in the messages (excluding the current user)
        const userIds = new Set();
        messages.forEach(message => {
            if (message.senderId.toString() !== currentUserId.toString()) {
                userIds.add(message.senderId.toString());
            }
            if (message.recipientId.toString() !== currentUserId.toString()) {
                userIds.add(message.recipientId.toString());
            }
        });

        // Step 3: Retrieve the user information (id, username, and profileImage) for these user IDs
        const users = await User.find({ _id: { $in: Array.from(userIds) } }, 'username profileImage');
        const userInfo = users.map(user => ({
            id: user._id,
            username: user.username,
            profileImage: user.profileImage || null // Ensures the profileImage is included
        }));

        // Return the list of userInfo objects
        return res.status(200).json(userInfo);
    } catch (error) {
        console.error('Error retrieving users:', error);
        return res.status(500).json({ message: 'Error retrieving users' });
    }
};

const getLastMessages = async (req, res) => {
    const currentUserId = req.user._id;

    try {
        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: currentUserId },
                        { recipientId: currentUserId }
                    ]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$senderId", currentUserId] },
                            then: "$recipientId",
                            else: "$senderId"
                        }
                    },
                    lastMessage: { $first: "$content" },
                    timestamp: { $first: "$timestamp" },
                    senderId: { $first: "$senderId" },
                    delivered: { $first: "$delivered" } // Include delivered status
                }
            }
        ]);

        const users = await User.find({ _id: { $in: messages.map(m => m._id) } }, 'username profileImage');
        const userMessages = users.map(user => {
            const msg = messages.find(m => m._id.equals(user._id));
            return {
                id: user._id,
                username: user.username,
                profileImage: user.profileImage || null, // Include profileImage
                lastMessage: msg.lastMessage,
                timestamp: msg.timestamp,
                senderId: msg.senderId,
                delivered: msg.delivered // Return delivered status
            };
        });

        res.status(200).json(userMessages);
    } catch (error) {
        console.error('Error fetching last messages:', error);
        res.status(500).json({ message: 'Error retrieving last messages' });
    }
};

const markMessagesAsRead = async (req, res) => {
    const { recipientId } = req.params;
    const currentUserId = req.user._id;

    try {
        await Message.updateMany(
            { senderId: recipientId, recipientId: currentUserId, delivered: false },
            { $set: { delivered: true } }
        );
        res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark messages as read', error: error.message });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    retrieveAllUsers,
    getLastMessages,
    markMessagesAsRead
};