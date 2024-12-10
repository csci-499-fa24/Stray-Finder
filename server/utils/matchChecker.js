const { ObjectId } = require('mongodb')
const Story = require('../models/story')
const MatchVotes = require('../models/MatchVotes')

const processHighMatches = async () => {
    try {
        const matches = await MatchVotes.find()

        const reportPairs = []
        for (const match of matches) {
            if (match.yes / match.no >= 1.75) {
                reportPairs.push([match.report1, match.report2])
            }
        }

        const groups = []
        for (const [report1, report2] of reportPairs) {
            let added = false

            for (const group of groups) {
                if (group.has(report1) || group.has(report2)) {
                    group.add(report1)
                    group.add(report2)
                    added = true
                    break
                }
            }

            if (!added) {
                groups.push(new Set([report1, report2]))
            }
        }

        for (const group of groups) {
            const reportIds = Array.from(group).map((id) => new ObjectId(id))

            const overlappingStories = await Story.find({
                animalReports: { $in: reportIds },
            })

            const existingReports = new Set(
                overlappingStories.flatMap((story) =>
                    story.animalReports.map(String)
                )
            )

            const combinedReports = Array.from(
                new Set([...existingReports, ...reportIds.map(String)])
            ).map((id) => new ObjectId(id))

            if (overlappingStories.length > 0) {
                const primaryStory = overlappingStories[0]
                primaryStory.animalReports = combinedReports
                await primaryStory.save()

                console.log(
                    `Updated story ${primaryStory._id} with consolidated reports.`
                )

                for (let i = 1; i < overlappingStories.length; i++) {
                    await Story.findByIdAndDelete(overlappingStories[i]._id)
                    console.log(
                        `Deleted duplicate story ${overlappingStories[i]._id}`
                    )
                }
            } else {
                const newStory = new Story({
                    animalReports: combinedReports,
                    description: `Story created from reports: ${combinedReports.join(
                        ', '
                    )}`,
                    dateCreated: new Date(),
                })

                await newStory.save()
                console.log(`New story created: ${newStory._id}`)
            }
        }
    } catch (error) {
        console.error('Error processing high matches:', error)
    }
}

// HTTP route handler for demo
const createStoryFromHighMatch = async (req, res) => {
    try {
        await processHighMatches()
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

setInterval(cronJob, 20 * 60 * 1000)

module.exports = createStoryFromHighMatch
