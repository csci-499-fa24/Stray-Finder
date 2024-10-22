const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/auth')
const {
    getUserProfile,
    updateUserPassword,
    deleteUser,
} = require('../controllers/user')

router
    .route('/')
    .get(authenticate, getUserProfile)
    .put(authenticate, updateUserPassword)
    .delete(authenticate, deleteUser)

module.exports = router