const express = require('express')
const router = express.Router()
const { register, login, logout } = require('../controllers/auth')
const authenticate = require('../middleware/auth')


// Endpoint to check if the user is authenticated
router.get('/', authenticate, (req, res) => {
    res.status(200).json({ authenticated: true })
})

// Register a new user
router.post('/register', register)

// Login an existing user
router.post('/login', login)

// Logout user
router.post('/logout', logout)

module.exports = router
