// server/controllers/profile.js
const User = require('../models/user'); // Update to your actual user model path
const uploadImage = require('../cloudinary/upload');

const uploadProfileImage = async (req, res) => {
    try {
        // Check if an image file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Upload image to Cloudinary
        const imageUrl = await uploadImage(req.file);

        // Update user profile with the new image URL
        const user = await User.findByIdAndUpdate(
            req.user._id, // Assuming authentication provides user ID
            { profileImage: imageUrl },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ profileImage: user.profileImage });
    } catch (error) {
        console.error('Error uploading profile image:', error.message);
        res.status(500).json({ message: 'Failed to upload profile image' });
    }
};

module.exports = { uploadProfileImage };
