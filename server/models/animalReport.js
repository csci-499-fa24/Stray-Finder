const mongoose = require('mongoose')

const AnimalReportSchema = new mongoose.Schema({
    animal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal', // Reference to the Animal model
        required: true,
    },
    location: {
        address: {
            type: String,
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'], // 'Point' for GeoJSON
                required: true,
            },
            coordinates: {
                type: [Number], // Array of numbers [lng, lat]
                required: true,
            },
        },
    },
    dateReported: {
        type: Date,
        default: Date.now,
    },
    reportType: {
        type: String,
        enum: ['Stray', 'Lost', 'Found'],
        required: true,
    },
    description: {
        type: String,
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    fixed: { type: String, enum: ['Yes', 'No', 'Unknown'], required: true },
    collar: { type: Boolean, required: true },
})

AnimalReportSchema.index({ coordinates: '2dsphere' })

module.exports = mongoose.model('AnimalReport', AnimalReportSchema)
