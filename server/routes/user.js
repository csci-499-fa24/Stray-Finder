const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/auth')

// GET user profile route
router.get('/profile', authenticate, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' })
    }
    res.json({ message: `Hello ${req.user.username}` })
})

module.exports = router
