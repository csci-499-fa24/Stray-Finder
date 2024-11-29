const AnimalReport = require('../models/animalReport')
const animal = require('../models/animal')
const User = require('../models/user')
const bcrypt = require('bcrypt')

// Get user profile (protected route)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -matchVotes._id') // Exclude password
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
            'bio',
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
        const user = await User.findById(req.params.id).select('username bio profileImage banner createdAt') // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json(user)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' })
    }
}

const getUserFoundCount = async (req, res) => {
    try {
        const userId = req.params.id;
        const count = await AnimalReport.countDocuments({
            reportedBy: userId,
            reportType: 'Found',
        });
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error fetching user found pets count:', error.message);
        res.status(500).json({ message: 'Failed to fetch found pets count' });
    }
};

const updateUserPreferences = async (req, res) => {
    try {
        console.log('Incoming request to update preferences');
        console.log('Request body:', req.body);

        const user = await User.findById(req.user.id);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const { notificationPreference } = req.body;
        if (!['immediate', 'daily', 'weekly', 'monthly', 'none'].includes(notificationPreference)) {
            console.log('Invalid preference:', notificationPreference);
            return res.status(400).json({ message: 'Invalid preference' });
        }

        user.notificationPreference = notificationPreference;
        await user.save();

        console.log('Preferences updated successfully');
        res.status(200).json({ message: 'Preferences updated successfully' });
    } catch (error) {
        console.error('Error updating preferences:', error.stack);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUserBanner = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { banner } = req.body;
        if (!banner) {
            return res.status(400).json({ message: 'Banner URL is required' });
        }

        user.banner = banner;
        await user.save();
        res.status(200).json({ banner: user.banner });
    } catch (error) {
        console.error('Error updating banner:', error);
        res.status(500).json({ message: 'Failed to update banner' });
    }
};

module.exports = { getUserProfile, updateUser, updateUserPassword, deleteUser, getUserById, getUserFoundCount, updateUserPreferences, updateUserBanner }