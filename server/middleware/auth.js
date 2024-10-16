const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authenticate = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)

        const user = await User.findById(decodedToken.userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Attach the user object to req.user
        req.user = user
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' })
        } else {
            return res.status(401).json({ message: 'Invalid token' })
        }
    }
}

module.exports = authenticate