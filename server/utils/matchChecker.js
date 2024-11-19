const Story = require('../models/story')
const MatchVotes = require('../models/MatchVotes')

// Core logic for processing matches and creating stories
const processHighMatches = async () => {
    try {
        const matches = await MatchVotes.find()

        for (const match of matches) {
            console.log('Processing match:', match)

            // Validate match criteria
            if (match.yes / match.no < 1.75) continue

            // Extract report IDs (no need for ._id since they are ObjectIds directly)
            const reportIds = [match.report1, match.report2]

            console.log('Checking existing story for reports:', reportIds)

            // Check if a story already exists for these reports
            const existingStory = await Story.findOne({
                animalReports: { $all: reportIds },
            })

            if (!existingStory) {
                // Create a new story if it doesn't exist
                const newStory = new Story({
                    animalReports: reportIds,
                    description: `Story created from reports ${reportIds[0]} and ${reportIds[1]}`,
                    dateCreated: new Date(),
                })

                await newStory.save()
                console.log(`New story created: ${newStory._id}`)
            } else {
                console.log(
                    `Story already exists for reports ${reportIds[0]} and ${reportIds[1]}`
                )
            }
        }
    } catch (error) {
        console.error('Error processing high matches:', error)
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
