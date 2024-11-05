const mongoose = require('mongoose')

const FeatureVectorSchema = new mongoose.Schema({
    animalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal',
        required: true,
        unique: true, // Ensure one feature vector per animal
    },
    vector: {
        type: [[Number]], // 2D array to accommodate large feature vectors
        required: true,
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

// Middleware to update `updatedAt` on vector modification
FeatureVectorSchema.pre('save', function (next) {
    this.updatedAt = Date.now()
    next()
})

module.exports =
    mongoose.models.FeatureVector ||
    mongoose.model('FeatureVector', FeatureVectorSchema)
