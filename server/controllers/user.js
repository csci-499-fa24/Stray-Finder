const User = require('../models/user')
const bcrypt = require('bcrypt')

// Get user profile (protected route)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password') // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

// Update user password (protected route)
const updateUserPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body

    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Check if the current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: 'Current password is incorrect' })
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        // Update the user's password
        user.password = hashedPassword
        await user.save()

        res.status(200).json({ message: 'Password updated successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

// Delete user (for admin or if user wants)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        await user.remove()
        res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

module.exports = { getUserProfile, updateUserPassword, deleteUser }