const mongoose = require('mongoose');

const MatchVotesSchema = new mongoose.Schema({
    report1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AnimalReport', // Reference to the AnimalReport model
        required: true,
    },
    report2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AnimalReport',
        required: true,
    },
    yes: {
        type: Number,
        required: true,
        min: 0,
    },
    no: {
        type: Number,
        required: true,
        min: 0,
    },
    unsure: {
        type: Number,
        required: true,
        min: 0,
    }
});

module.exports = mongoose.model('MatchVotes', MatchVotesSchema);
