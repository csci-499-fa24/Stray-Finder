const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res
            .status(401)
            .json({ message: 'Authorization header missing or malformed' })
    }
    const token = authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findById(decodedToken.userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        req.userId = decodedToken.userId;
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
