const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { sendEmail } = require('./email');
const Message = require('../models/message');

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

        // Add a welcome message to the user's inbox
        const strayFinderUserId = '67380f3303b2a7f7d8a8543c'; 
        const welcomeMessage = new Message({
            senderId: strayFinderUserId,
            recipientId: user._id,
            content: `Hi ${username}, welcome to Stray Finder! We're so glad you joined us. Explore the platform and help connect pets with their families.`,
            delivered: false,
        });
        await welcomeMessage.save();

        // Compose a welcome email
        const emailSubject = 'Welcome to Stray Finder!';
        const emailBody = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <!-- Header Section -->
            <div style="background-color: #fdf2e9; padding: 20px; text-align: center;">
                <img src="https://raw.githubusercontent.com/csci-499-fa24/Stray-Finder/refs/heads/main/client/app/components/layouts/assets/file.png" alt="Stray Finder Logo" style="width: 80px; margin-bottom: 10px;">
                <h1 style="font-size: 24px; color: #555; margin: 0;">Welcome to Stray Finder!</h1>
            </div>

            <!-- Main Content -->
            <div style="padding: 20px;">
                <p style="font-size: 18px; margin: 0 0 15px;">Hi ${username},</p>
                <p style="margin: 0 0 15px;">
                    Thank you for joining Stray Finder! We’re thrilled to have you as part of our community dedicated to helping stray animals find their way home.
                </p>
                <p style="margin: 0 0 15px;">
                    Ready to get started? Check out the latest reports and help connect missing pets with their owners.
                </p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="https://stray-finder-client.onrender.com/" 
                    style="background-color: #ff6f61; color: white; text-decoration: none; font-size: 16px; padding: 10px 20px; border-radius: 4px; display: inline-block;">
                        Get Started
                    </a>
                </div>
            </div>

            <!-- Footer Section -->
            <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
                <p style="margin: 0; font-size: 14px; color: #777;">
                    If you have any questions, feel free to reach out to us at 
                    <a href="mailto:support@strayfinder.com" style="color: #ff6f61;">support@strayfinder.com</a>.
                </p>
                <p style="margin: 10px 0 0; font-size: 14px; color: #aaa;">
                    © 2024 Stray Finder. All rights reserved.
                </p>
            </div>
        </div>
        `;


        // Send the welcome email
        await sendEmail({
            targetEmail: email,
            subject: emailSubject,
            body: emailBody,
        });

        res.status(201).json({ message: 'User successfully registered!' })
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: errors.join(', ') }); // combine all messages
        }
        res.status(500).json({ message: 'Server error during registration' });
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
            return res.status(401).json({ message: 'Incorrect username or password' })
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

const logout = (req, res) => {
    res.clearCookie('token', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });
    return res.status(200).json({ message: 'Logout successful' });
    
};

module.exports = { register, login, logout }
