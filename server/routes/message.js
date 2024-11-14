const express = require('express');
const auth = require('../middleware/auth');
const {
    sendMessage, 
    getMessages,
    retrieveAllUsers,
    getLastMessages,
    markMessagesAsRead
} = require('../controllers/message');
const router = express.Router();

// GET routes
router.get('/last-messages', auth, getLastMessages);
router.get('/:otherUserId', auth, getMessages);
router.get('', auth, retrieveAllUsers);

// POST routes
router.post('/mark-as-read/:recipientId', auth, markMessagesAsRead);
router.post('/:recipientId', auth, sendMessage);

module.exports = router;