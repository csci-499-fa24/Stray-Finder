const express = require('express');
const auth = require('../middleware/auth');
const {
    sendMessage, 
    getMessages,
    retrieveAllUsers,
    getLastMessages
} = require('../controllers/message');
const router = express.Router();

router.get('/last-messages', auth, getLastMessages);
router.post('/:recipientId', auth, sendMessage);
router.get('/:otherUserId', auth, getMessages);
router.get('', auth, retrieveAllUsers);

module.exports = router;