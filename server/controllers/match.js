const { calculateMatchScore } = require('../utils/matcher/reportMatcher')
const Report = require('../models/animalReport')

const matchReports = async (req, res) => {
    const { report1Id, report2Id } = req.body

    if (!report1Id || !report2Id) {
        return res
            .status(400)
            .json({ error: 'Two report IDs are required for matching.' })
    }

    try {
        // Fetch the reports with populated animal data
        const report1 = await Report.findById(report1Id).populate('animal')
        const report2 = await Report.findById(report2Id).populate('animal')

        // Check if reports exist
        if (!report1 || !report2) {
            return res
                .status(404)
                .json({ error: 'One or both reports not found.' })
        }

        // Check if both reports have an associated animal
        if (!report1.animal || !report2.animal) {
            return res.status(400).json({
                error: 'One or both reports do not have an associated animal.',
            })
        }

        // Calculate the match score
        const matchScore = await calculateMatchScore(report1, report2)

        // Respond with the match score
        res.status(200).json({ matchScore })
    } catch (error) {
        console.error('Error matching reports:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = { matchReports }