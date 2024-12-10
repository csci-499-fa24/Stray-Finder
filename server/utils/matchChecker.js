const { ObjectId } = require('mongodb') // Import ObjectId from the mongodb package
const Story = require('../models/story')
const MatchVotes = require('../models/MatchVotes')

const processHighMatches = async () => {
    try {
        const matches = await MatchVotes.find()

        // Collect all unique report pairs
        const allReportPairs = []

        for (const match of matches) {
            // Validate match criteria
            if (match.yes / match.no < 1.75) continue

            const reportIds = [match.report1, match.report2]
            allReportPairs.push(reportIds)
        }

        // Flatten and deduplicate report pairs into a single array of unique IDs
        const allReports = Array.from(
            new Set(allReportPairs.flat().map(String)) // Convert ObjectIds to strings to ensure proper deduplication
        ).map((id) => new ObjectId(id)) // Convert back to ObjectId

        console.log('Checking existing stories for reports:', allReports)

        // Check for existing stories that overlap with the reports
        const overlappingStories = await Story.find({
            animalReports: { $in: allReports },
        })

        // Consolidate all overlapping story reports into a single set
        const existingReports = new Set(
            overlappingStories.flatMap((story) =>
                story.animalReports.map(String)
            )
        )

        // Combine existing reports with new reports
        const combinedReports = Array.from(
            new Set([...existingReports, ...allReports.map(String)])
        ).map((id) => new ObjectId(id)) // Convert back to ObjectId

        if (overlappingStories.length > 0) {
            // Update the first overlapping story with the combined reports
            const primaryStory = overlappingStories[0]
            primaryStory.animalReports = combinedReports
            await primaryStory.save()

            console.log(
                `Updated story ${primaryStory._id} with consolidated reports.`
            )
        } else if (combinedReports.length > 0) {
            // Create a new story if no overlapping stories exist
            const newStory = new Story({
                animalReports: combinedReports,
                description: `Story created from reports: ${combinedReports.join(
                    ', '
                )}`,
                dateCreated: new Date(),
            })

            await newStory.save()
            console.log(`New story created: ${newStory._id}`)
        } else {
            console.log('All reports are already covered by existing stories.')
        }
    } catch (error) {
        console.error('Error processing high matches:', error)
    }
}

// HTTP route handler for demo
const createStoryFromHighMatch = async (req, res) => {
    try {
        await processHighMatches() // Call the shared logic
        res.status(200).send('Task completed')
    } catch (error) {
        console.error('Error creating stories from high matches:', error)
        res.status(500).send('Task failed')
    }
}

const cronJob = async () => {
    try {
        await processHighMatches()
        console.log('Cron job completed successfully')
    } catch (error) {
        console.error('Error running cron job for high matches:', error)
    }
}

setInterval(cronJob, 20 * 60 * 1000) // Runs every 20 minutes

module.exports = createStoryFromHighMatch
