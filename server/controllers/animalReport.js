const AnimalReport = require('../models/animalReport')
const Animal = require('../models/animal')
const User = require('../models/user')

/**
 * @get     : Retrieves list of animal reports
 * @route   : GET /api/animal-reports
 * @access  : public
 * @description : 
    to use filter, go to server/api/animal-reports?key=value&key=value
    question mark to filter
    keys are animal, reportType, reportedBy
    if there are spaces in a value, use '+' as separator

 * @example /api/animal-reports?reportType=Lost&animal=634ebd8fdfad7fbc9c918b4a
 */
const getAnimalReports = async (req, res) => {
    try {
        const { animal, reportType, reportedBy } = req.query // query parameters
        let query = {} // query object

        const fields = { animal, reportType, reportedBy } // values of all the keys

        Object.keys(fields).forEach((key) => {
            if (fields[key]) {
                query[key] = fields[key].trim() // apply query filter if value exists
            }
        })

        const reports = await AnimalReport.find(query)
            .populate('animal') // populate animal data
            .populate('reportedBy') // populate user data
            .exec()

        res.status(200).json({ reports })
    } catch (error) {
        console.error('Error fetching animal reports:', {
            message: error.message,
            stack: error.stack,
            request: {
                headers: req.headers,
                body: req.body,
                query: req.query,
            },
        })
        res.status(500).json({
            message: 'Failed to fetch animal reports',
            error: error.message,
        })
    }
}

/**
 * @post    : Creates a new animal report
 * @route   : POST /api/animal-reports
 * @access  : public
 */
const createAnimalReport = async (req, res) => {
    try {
        const { animal, location, reportType, description, reportedBy } =
            req.body

        if (!animal || !location || !reportType || !reportedBy) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        // Check if the animal and user exist
        const foundAnimal = await Animal.findById(animal)
        const foundUser = await User.findById(reportedBy)

        if (!foundAnimal || !foundUser) {
            return res.status(404).json({ message: 'Animal or User not found' })
        }

        const formattedReport = {
            animal,
            location,
            reportType,
            description,
            reportedBy,
        }

        const report = await AnimalReport.create(formattedReport)
        res.status(201).json({ report })
    } catch (error) {
        console.error('Error creating animal report:', error.message)
        res.status(500).json({
            message: 'Failed to create animal report',
            error: error.message,
        })
    }
}

/**
 * @get     : Retrieves a specific animal report by ID
 * @route   : GET /api/animal-reports/:id
 * @access  : public
 */
const getAnimalReportById = async (req, res) => {
    try {
        const { id } = req.params
        const report = await AnimalReport.findById(id)
            .populate('animal')
            .populate('reportedBy')
            .exec()

        if (!report) {
            return res.status(404).json({ message: 'Animal report not found' })
        }

        res.status(200).json({ report })
    } catch (error) {
        console.error('Error fetching animal report by ID:', error.message)
        res.status(500).json({
            message: 'Failed to fetch animal report',
            error: error.message,
        })
    }
}

/**
 * @put     : Updates an animal report by ID
 * @route   : PUT /api/animal-reports/:id
 * @access  : public
 */
const updateAnimalReport = async (req, res) => {
    try {
        const { id } = req.params
        const { location, reportType, description } = req.body

        const updatedReport = await AnimalReport.findByIdAndUpdate(
            id,
            { location, reportType, description },
            { new: true }
        )

        if (!updatedReport) {
            return res.status(404).json({ message: 'Animal report not found' })
        }

        res.status(200).json({ report: updatedReport })
    } catch (error) {
        console.error('Error updating animal report:', error.message)
        res.status(500).json({
            message: 'Failed to update animal report',
            error: error.message,
        })
    }
}

/**
 * @delete  : Deletes an animal report by ID
 * @route   : DELETE /api/animal-reports/:id
 * @access  : public
 */
const deleteAnimalReport = async (req, res) => {
    try {
        const { id } = req.params
        const deletedReport = await AnimalReport.findByIdAndDelete(id)

        if (!deletedReport) {
            return res.status(404).json({ message: 'Animal report not found' })
        }

        res.status(200).json({
            message: 'Animal report deleted successfully',
            report: deletedReport,
        })
    } catch (error) {
        console.error('Error deleting animal report:', error.message)
        res.status(500).json({
            message: 'Failed to delete animal report',
            error: error.message,
        })
    }
}

module.exports = {
    getAnimalReports,
    createAnimalReport,
    getAnimalReportById,
    updateAnimalReport,
    deleteAnimalReport,
}
