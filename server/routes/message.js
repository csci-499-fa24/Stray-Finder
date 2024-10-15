const express = require('express');
const auth = require('../middleware/auth');
const {
    sendMessage, 
    getMessages,
} = require('../controllers/message');
const router = express.Router();

router.post('/', auth, sendMessage);
router.get('/:otherUserId', auth, getMessages);

module.exports = router;