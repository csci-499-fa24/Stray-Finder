const express = require('express')
const router = express.Router()
const {
    getStories,
    getStory,
    createStory,
    updateStory,
    deleteStory
} = require('../controllers/story')
const authenticate = require('../middleware/auth')

router
    .route('/')
    .get(getStories)
    .post(authenticate, createStory)

router
    .route('/:id')
    .get(getStory)
    .put(authenticate, updateStory)
    .delete(authenticate, deleteStory)

module.exports = router