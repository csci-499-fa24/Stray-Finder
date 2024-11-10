const animal = require('../models/animal')
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

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found'});
        }
        
        const fieldsToUpdate = [
            'username',
            'email',
        ]
        fieldsToUpdate.forEach((field) => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field]
            }
        })
        const updatedUser = await user.save();
        res.status(200).json({ user: updatedUser });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user' })
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
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
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

// Get user profile by ID (this is not a protected route)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('username') // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json(user)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' })
    }
}

module.exports = { getUserProfile, updateUser, updateUserPassword, deleteUser, getUserById }