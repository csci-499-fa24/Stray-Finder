const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/auth')
const {
    getUserProfile,
    updateUser,
    updateUserPassword,
    deleteUser,
    getUserById,
    updateUserPreferences,
    updateUserBanner,
    getUserFoundCount,
} = require('../controllers/user')

router.get('/:id/found-count', getUserFoundCount);

router
    .route('/')
    .get(authenticate, getUserProfile)
    .post(authenticate, updateUser)
    .put(authenticate, updateUserPassword)
    .delete(authenticate, deleteUser)

router
    .route('/:id')
    .get(getUserById)

router.post('/preferences', authenticate, updateUserPreferences);
router.post('/banner', authenticate, updateUserBanner);

module.exports = router