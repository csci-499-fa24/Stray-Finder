const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

// Register new user
const register = async (req, res, next) => {
    const { username, email, password } = req.body

    try {
        // Check for duplicate user
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        })
        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'Username or email already exists' })
        }

        // Create a new user without manually hashing
        const user = new User({ username, email, password })
        await user.save()

        res.status(201).json({ message: 'User successfully registered!' })
    } catch (error) {
        next(error)
    }
}

// Login existing user
const login = async (req, res, next) => {
    const { username, password } = req.body

    try {
        // Find user by username
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Compare password
        const passwordMatch = await user.comparePassword(password)
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' })
        }

        // Sign JWT token
        try {
            const token = jwt.sign(
                { userId: user._id },
                process.env.SECRET_KEY,
                {
                    expiresIn: '2h',
                }
            )

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Secure flag for production
                sameSite:
                    process.env.NODE_ENV === 'production' ? 'None' : 'Strict', // 'None' for production, 'Strict' for localhost
                maxAge: 60 * 60 * 1000, // 1 hour
            })

            res.status(200).json({ message: `Welcome ${user.username}` })
        } catch (error) {
            return next(error)
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { register, login }
