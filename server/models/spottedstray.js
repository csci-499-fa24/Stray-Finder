const mongoose = require('mongoose')

const SpottedStraySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    species: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
    },
    color: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Unknown'],
        default: 'Unknown',
    },
    description: {
        type: String,
    },
    imageUrl: {
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
    dateReported: {
        type: Date,
        default: Date.now,
    },
})

SpottedStraySchema.index({ coordinates: '2dsphere' })

module.exports = mongoose.model('SpottedStrays', SpottedStraySchema)