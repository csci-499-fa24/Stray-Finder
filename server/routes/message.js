const express = require('express');
const auth = require('../middleware/auth');
const {
    sendMessage, 
    getMessages,
    retrieveAllUsers
} = require('../controllers/message');
const router = express.Router();

router.post('/:recipientId', auth, sendMessage);
router.get('/:otherUserId', auth, getMessages);
router.get('', auth, retrieveAllUsers);

module.exports = router;