const { calculateMatchScore } = require('../utils/reportMatcher')

const matchReports = (req, res) => {
    const { report1, report2 } = req.body

    if (!report1 || !report2) {
        return res
            .status(400)
            .json({ error: 'Two reports are required for matching.' })
    }

    try {
        // Calculate match score
        const matchScore = calculateMatchScore(report1, report2)

        // Respond with match score
        res.status(200).json({ matchScore })
    } catch (error) {
        console.error('Error matching reports:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = { matchReports }
