const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    animalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Open', 'Resolved', 'Closed'],
        default: 'Open',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Report', ReportSchema)
