const { Story } = require('../models/story')
const MatchVotes = require('../models/MatchVotes')

// Core logic for processing matches and creating stories
const processHighMatches = async () => {
    const matches = await MatchVotes.find()

    for (const match of matches) {
        // Validate match criteria
        if (match.yes < 100 && match.no < 100) continue
        if (match.yes / match.no < 2) continue

        // Check if a story already exists for the matched reports
        const existingStory = await Story.findOne({
            animalReports: { $all: [match.report1._id, match.report2._id] },
        })

        // If a story doesn't exist, create a new one
        if (!existingStory) {
            const newStory = new Story({
                animalReports: [match.report1._id, match.report2._id],
                description: `Story created from reports ${match.report1._id} and ${match.report2._id}`,
                createdAt: new Date(),
            })

            await newStory.save()
            console.log(`New story created: ${newStory._id}`)
        } else {
            console.log(
                `Story already exists for reports ${match.report1._id} and ${match.report2._id}`
            )
        }
    }
}

// Middleware wrapper for HTTP request to use in demo
const createStoryFromHighMatch = async (req, res, next) => {
    try {
        await processHighMatches() // Call the shared logic
        res.status(200).send('Task completed')
    } catch (error) {
        console.error('Error creating stories from high matches:', error)
        res.status(500).send('Task failed')
    }
}

// Export the middleware
module.exports = createStoryFromHighMatch
