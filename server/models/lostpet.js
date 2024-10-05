const mongoose = require('mongoose')

const StraySchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Unknown',
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

StraySchema.index({ coordinates: '2dsphere' })

module.exports = mongoose.model('Stray', StraySchema)