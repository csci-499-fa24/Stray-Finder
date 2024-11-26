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
const getHighMatches = async (req, res) => {
    try {
        const allLostReports = await Report.find({ reportType: 'Lost' }).populate('animal');
        const allStrayReports = await Report.find({ reportType: 'Stray' }).populate('animal');

        const highMatches = [];

        for (const report1 of allLostReports) {
            for (const report2 of allStrayReports) {
                const score = await calculateMatchScore(report1, report2);
                if (score >= .90) { // only take matches with score >= .90 (90%)
                    highMatches.push({ report1, report2, score });
                }
            }
        }

        for (const report1 of allStrayReports) {
            for (const report2 of allStrayReports) {
                if (report1 !== report2) {
                    const exists = highMatches.some(match => // check if pair already in highMatches
                        (match.report1 === report1 && match.report2 === report2) || 
                        (match.report1 === report2 && match.report2 === report1)
                    );
                    if (!exists) {
                        const score = await calculateMatchScore(report1, report2);
                        
                        if (score >= 0.90) {
                            highMatches.push({ report1, report2, score });
                            // console.log("High Matches:", highMatches);
                        }
                    }
                }                
            }
        }

        res.status(200).json({ matches: highMatches });

    } catch (error) {
        console.error('Error in matching reports:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = { matchReports, getHighMatches }
