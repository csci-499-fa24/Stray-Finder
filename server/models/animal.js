const mongoose = require('mongoose')

const AnimalSchema = new mongoose.Schema({
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
    fixed: {
        type: String,
        enum: ['Yes', 'No', 'Unknown'],
        default: 'Unknown',
    },
    collar: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
})

module.exports = mongoose.model('Animal', AnimalSchema)
