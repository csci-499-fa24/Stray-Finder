const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/auth')
const {
    getUserProfile,
    updateUserPassword,
    deleteUser,
    getUserById,
} = require('../controllers/user')

router
    .route('/')
    .get(authenticate, getUserProfile)
    .put(authenticate, updateUserPassword)
    .delete(authenticate, deleteUser)

router
    .route('/:id')
    .get(getUserById)

module.exports = router