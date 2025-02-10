// server/controllers/profile.js
const User = require('../models/user')
const { uploadImage } = require('../cloudinary/utils')
const { extractPublicId } = require('../cloudinary/utils')
const cloudinary = require('cloudinary').v2
require('dotenv').config()

const uploadProfileImage = async (req, res) => {
    try {
        // Check if an image file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' })
        }

        console.log('Image file received for upload:', req.file)

        // Find the user
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // If the user already has a profile image, delete it from Cloudinary
        if (user.profileImage && user.profileImage.trim() !== '') {
            const oldPublicId = extractPublicId(user.profileImage)
            if (oldPublicId) {
                const deletionResult = await cloudinary.uploader.destroy(
                    oldPublicId
                )
                console.log(
                    `Deleted old Cloudinary asset ${oldPublicId}:`,
                    deletionResult
                )
            } else {
                console.warn(
                    'Could not extract public ID from the existing profile image:',
                    user.profileImage
                )
            }
        }

        // Upload new image to Cloudinary
        const imageUrl = await uploadImage(req.file)
        console.log('Image uploaded to Cloudinary. New URL:', imageUrl)

        // Update user profile with the new image URL
        user.profileImage = imageUrl
        await user.save()

        console.log('Updated user profile image:', user.profileImage)
        res.status(200).json({ profileImage: user.profileImage })
    } catch (error) {
        console.error('Error uploading profile image:', error.message)
        res.status(500).json({ message: 'Failed to upload profile image' })
    }
}

module.exports = { uploadProfileImage }
