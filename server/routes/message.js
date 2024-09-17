const express = require('express')
const router = express.Router()
const { getMessages, createMessage } = require('../controllers/message')

router
    .route('/')
    .get(getMessages)
    .post(createMessage)

module.exports = router