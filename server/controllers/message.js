const Message = require('../models/message');
const User = require('../models/user');

const sendMessage = async (req, res) => {
    const { recipientId, content } = req.body;
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

module.exports = {
    sendMessage,
    getMessages,
};