const Message = require('../models/message')

/**
 * @post   : Retrieves the message
 * @route  : GET /api/message
 * @access : public
 */
const getMessages = async (req, res) => {
    const message = await Message.find()
    res.status(200).json({ message })
}

/**
 * @post    : Updates the message
 * @route   : POST /api/message
 * @access  : public (at the moment)
 */
const createMessage = async (req, res) => {
    console.log('Request body:', req.body) // Log the incoming request body

    try {
        const message = await Message.create(req.body)
        res.status(201).json({ message })
    } catch (error) {
        console.error('Error:', error.message) // Log any errors
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getMessages,
    createMessage,
}
