const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authenticate = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res
            .status(401)
            .json({ authenticated: false, message: 'Authentication required' })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)

        const user = await User.findById(decodedToken.userId)

        if (!user) {
            return res
                .status(404)
                .json({ authenticated: false, message: 'User not found' })
        }

        req.user = user

        req.isAuthenticated = true

        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res
                .status(401)
                .json({ authenticated: false, message: 'Token expired' })
        } else {
            return res
                .status(401)
                .json({ authenticated: false, message: 'Invalid token' })
        }
    }
}

module.exports = authenticate
