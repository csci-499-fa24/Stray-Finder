const mongoose = require('mongoose')

const AnimalSchema = new mongoose.Schema(
    {
        // Array of names given by users
        givenNames: [
            {
                name: {
                    type: String,
                    required: true,
                },
                givenBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User', // Reference to the user who gave the name
                    required: true,
                },
                givenAt: {
                    type: Date,
                    default: Date.now, // Timestamp of when the name was given
                },
            },
        ],

        // metadata
        species: {
            type: String,
            required: true, // e.g., "dog", "cat", etc.
            enum: ['dog', 'cat', 'bird', 'other'],
        },
        breed: {
            type: String, // e.g., "Golden Retriever", "Siamese", etc.
            required: false,
        },
        color: {
            type: String,
            required: true, // e.g., "black", "brown", "white"
        },
        size: {
            type: String, // e.g., "small", "medium", "large"
            required: true,
            enum: ['small', 'medium', 'large'],
        },
        uniqueIdentifiers: {
            type: String, // e.g., "missing right ear", "blue collar"
            required: false,
        },
        behavior: {
            type: String, // e.g., "aggressive", "shy", "friendly"
            required: false,
        },
        imageURL: {
            type: String, // URL to the image uploaded by the user
            required: true,
        },

        // Location and time of sighting
        location: {
            latitude: {
                type: Number,
                required: true,
            },
            longitude: {
                type: Number,
                required: true,
            },
            address: {
                type: String, // Optional field if users enter a known address
                required: false,
            },
        },
        sightingDate: {
            type: Date,
            required: true,
            default: Date.now,
        },

        // User info and reporting details
        reportedBy: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User', // Reference to the User schema
                    required: true,
                },
                reportedAt: {
                    type: Date,
                    default: Date.now, // Timestamp for when the sighting was reported
                },
                additionalInfo: {
                    type: String, // Optional field for any additional information provided by the user
                    required: false,
                },
            },
        ],

        status: {
            type: String, // e.g., "stray", "reunited", "adopted"
            required: true,
            enum: ['stray', 'reunited', 'adopted', 'in_progress'],
            default: 'stray',
        },
        claimedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User schema
            required: false,
        },

        // Timestamps for automatic tracking
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Animal', AnimalSchema)
