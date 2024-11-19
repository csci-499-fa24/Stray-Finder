const Story = require('../models/story')

const getStories = async (req, res) => {
    try {
        const stories = await Story.find()
            .populate('animalReports')

        res.status(200).json(stories)
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stories' })
    }
}

// returns story by id
const getStory = async (req, res) => {
    const { id } = req.params

    try {
        const story = await Story.findById(id)
            .populate('animalReports')

        if (!story) {
            return res.status(404).json({ error: 'Story not found' })
        }

        res.status(200).json(story)
    } catch (error) {
        res.status(500).json({ error: 'Error fetching the story' })
    }
}


// creates a story (takes two reports and initialies a story with them)
const createStory = async (req, res) => {
    const { reportIds, animalId } = req.body

    try {
        // Check if all reports and the animal exist
        const reports = await AnimalReport.find({ _id: { $in: reportIds } })
        if (reports.length !== reportIds.length) {
            return res
                .status(400)
                .json({ error: 'One or more reports not found' })
        }

        // Create the story
        const newStory = new Story({
            animalReports: reportIds,
        })

        const savedStory = await newStory.save()
        res.status(201).json(savedStory)
    } catch (error) {
        res.status(500).json({ error: 'Error creating the story' })
    }
}


// updates story to add or remove animalReport
const updateStory = async (req, res) => {
    const { id } = req.params
    const { reportId, action } = req.body // `action` should be 'add' or 'remove'

    try {
        const story = await Story.findById(id)
        if (!story) {
            return res.status(404).json({ error: 'Story not found' })
        }

        if (action === 'add') {
            // Add the report if not already included
            if (!story.animalReports.includes(reportId)) {
                story.animalReports.push(reportId)
            }
        } else if (action === 'remove') {
            // Remove the report
            story.animalReports = story.animalReports.filter(
                (report) => report.toString() !== reportId
            )
        } else {
            return res.status(400).json({ error: 'Invalid action' })
        }

        const updatedStory = await story.save()
        res.status(200).json(updatedStory)
    } catch (error) {
        res.status(500).json({ error: 'Error updating the story' })
    }
}


// deletes a story
const deleteStory = async (req, res) => {
    const { id } = req.params

    try {
        const story = await Story.findById(id)
        if (!story) {
            return res.status(404).json({ error: 'Story not found' })
        }

        await story.deleteOne()
        res.status(200).json({ message: 'Story deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Error deleting the story' })
    }
}

module.exports = {
    getStories,
    getStory,
    createStory,
    updateStory,
    deleteStory
}
