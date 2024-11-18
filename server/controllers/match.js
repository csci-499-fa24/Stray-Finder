const { calculateMatchScore } = require('../utils/matcher/reportMatcher')
const Report = require('../models/animalReport')
const mongoose = require('mongoose')

const matchReports = async (req, res) => {
    const { id: reportId } = req.params

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
        return res.status(400).json({ error: 'Invalid report ID.' })
    }

    try {
        // Fetch the specified report
        const targetReport = await Report.findById(reportId).populate('animal').populate('reportedBy', 'username');

        if (!targetReport || !targetReport.animal) {
            return res.status(404).json({ error: 'Report not found or has no associated animal.' })
        }

        // Fetch all other reports
        const otherReports = await Report.find({ _id: { $ne: reportId } }).populate('animal').populate('reportedBy', 'username');

        // Calculate match scores
        const matchScores = await Promise.all(
            otherReports.map(async (report) => {
                const score = await calculateMatchScore(targetReport, report)
                return { report, score }
            })
        )

        // Respond with the match scores and their corresponding reports
        res.status(200).json({
            targetReport,
            matches: matchScores,
        })
    } catch (error) {
        console.error('Error in matching reports:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = { matchReports }
