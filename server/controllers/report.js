const Report = require('../models/report')

// Create a new report
const createReport = async (req, res) => {
    try {
        const { animalId, description, reason } = req.body
        const report = new Report({
            userId: req.user._id,
            animalId,
            description,
            reason,
        })

        await report.save()

        res.status(201).json(report)
    } catch (error) {
        res.status(500).json({ message: 'Error creating report', error: error.message })
    }
}

// Get reports
const getReports = async (req, res) => {
    try {
        // Fetch only reports belonging to the authenticated user
        const reports = await Report.find({ userId: req.user._id }).populate('animalId userId');
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports', error: error.message });
    }
}

// Update a report
const updateReport = async (req, res) => {
    try {
        const { id } = req.params
        const report = await Report.findById(id)

        // Check if the report exists
        if (!report) {
            return res.status(404).json({ message: 'Report not found' })
        }

        // Check if the logged-in user is the owner of the report
        if (report.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this report' })
        }

        // Update the report
        const updatedReport = await Report.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(updatedReport)
    } catch (error) {
        res.status(500).json({ message: 'Error updating report', error: error.message })
    }
}

// Delete a report
const deleteReport = async (req, res) => {
    try {
        const { id } = req.params
        const report = await Report.findById(id)

        // Check if the report exists
        if (!report) {
            return res.status(404).json({ message: 'Report not found' })
        }

        // Check if the logged-in user is the owner of the report
        if (report.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this report' })
        }

        // Delete the report
        await report.remove()
        res.status(200).json({ message: 'Report deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Error deleting report', error: error.message })
    }
}

module.exports = { createReport, getReports, updateReport, deleteReport }
