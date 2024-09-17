const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'must provide a message'],
        trim: true,
    },
})

module.exports = mongoose.model('Message', MessageSchema)