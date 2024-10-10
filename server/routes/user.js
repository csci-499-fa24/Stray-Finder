const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/auth')

// GET user profile route
router.get('/profile', authenticate, (req, res) => {
    res.json({ message: `Hello ${req.user.username}` })
})

module.exports = router
