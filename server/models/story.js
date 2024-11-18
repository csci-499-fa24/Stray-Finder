const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
    animalReports: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'AnimalReport' },
    ],
    animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal' },
    dateCreated: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Story', StorySchema)
