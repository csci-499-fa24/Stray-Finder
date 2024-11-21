const Message = require('../models/message');
const User = require('../models/user');
const express = require('express');
const { sendEmail } = require('./email');
const app = express();

app.use(express.json());


const sendMessage = async (req, res) => {
    const { content, animalReportId } = req.body; 
    const recipientId = req.params.recipientId;

    if (!recipientId || !content) {
        return res.status(400).json({ message: 'Recipient and content are required' });
    }

    try {
        // Save the message
        const message = new Message({
            senderId: req.user._id,
            recipientId,
            content,
            animalReportId: animalReportId || null 
        });
        await message.save();

        // Fetch recipient details, including notification preferences
        const recipient = await User.findById(recipientId).select('email username notificationPreference');
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        // Check recipient's notification preference
        if (recipient.notificationPreference === 'immediate') {
            // Fetch sender details for personalization
            const sender = await User.findById(req.user._id).select('username');

            // Compose the email
            const emailSubject = `New Message from ${sender.username}`;
            const emailBody = `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <!-- Header Section -->
                    <div style="background-color: #fdf2e9; padding: 20px; text-align: center;">
                        <img src="https://raw.githubusercontent.com/csci-499-fa24/Stray-Finder/refs/heads/main/client/app/components/layouts/assets/file.png" alt="Stray Finder Logo" style="width: 80px; margin-bottom: 10px;">
                        <h1 style="font-size: 24px; color: #555; margin: 0;">You’ve Got a New Message!</h1>
                    </div>

                    <!-- Main Content -->
                    <div style="padding: 20px;">
                        <p style="font-size: 18px; margin: 0 0 15px;">Hi ${recipient.username},</p>
                        <p style="margin: 0 0 15px;">
                            ${sender.username} has sent you a message:
                        </p>
                        <blockquote style="margin: 0 0 15px; font-size: 16px; font-style: italic; color: #555; border-left: 4px solid #ff6f61; padding-left: 10px;">
                            ${content}
                        </blockquote>
                        <p style="margin: 0 0 15px;">
                            Log in to your account to view the full conversation and respond.
                        </p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="https://stray-finder-client.onrender.com/userMessages" 
                               style="background-color: #ff6f61; color: white; text-decoration: none; font-size: 16px; padding: 10px 20px; border-radius: 4px; display: inline-block;">
                                View Messages
                            </a>
                        </div>
                    </div>

                    <!-- Footer Section -->
                    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
                        <p style="margin: 0; font-size: 14px; color: #777;">
                            If you have any questions, feel free to reach out to us at 
                            <a href="mailto:support@strayfinder.com" style="color: #ff6f61;">support@strayfinder.com</a>.
                        </p>
                        <p style="margin: 10px 0 0; font-size: 14px; color: #aaa;">
                            © 2024 Stray Finder. All rights reserved.
                        </p>
                    </div>
                </div>
            `;

            // Send email notification
            await sendEmail({
                targetEmail: recipient.email,
                subject: emailSubject,
                body: emailBody,
            });
        }

        return res.status(201).json(message);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
};

const getMessages = async (req, res) => {
    const { otherUserId } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.user._id, recipientId: otherUserId },
                { senderId: otherUserId, recipientId: req.user._id }
            ]
        })
        .populate({
            path: 'animalReportId',  
            populate: {
                path: 'animal', 
                select: 'name imageUrl species' 
            }
        })
        .sort({ timestamp: 1 });

        await Message.updateMany(
            { senderId: otherUserId, recipientId: req.user._id, read: false },
            { $set: { read: true } }
        );

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get messages', error: error.message });
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
                    read: { $first: "$read" } // Include read status
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
                read: msg.read // Return read status
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
            { senderId: recipientId, recipientId: currentUserId, read: false },
            { $set: { read: true } }
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