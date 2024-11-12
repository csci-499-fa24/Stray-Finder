// server/controllers/profile.js
const User = require('../models/user');
const uploadImage = require('../cloudinary/upload');

const uploadProfileImage = async (req, res) => {
    try {
        // Check if an image file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        console.log("Image file received for upload:", req.file); // Log file received

        // Upload image to Cloudinary
        const imageUrl = await uploadImage(req.file);
        console.log("Image uploaded to Cloudinary. URL:", imageUrl); // Log uploaded URL

        // Update user profile with the new image URL
        const user = await User.findByIdAndUpdate(
            req.user._id, 
            { profileImage: imageUrl },
            { new: true }
        );
        console.log(user)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ profileImage: user.profileImage });
        console.log(user.profileImage)
    } catch (error) {
        console.error('Error uploading profile image:', error.message);
        res.status(500).json({ message: 'Failed to upload profile image' });
    }
};

module.exports = { uploadProfileImage };
