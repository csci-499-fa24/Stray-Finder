// server/routes/profile.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadProfileImage } = require('../controllers/profile');
const authenticate = require('../middleware/auth');

// POST: Upload profile image
router.post('/upload-profile-image', authenticate, upload.single('image'), uploadProfileImage);

module.exports = router;
