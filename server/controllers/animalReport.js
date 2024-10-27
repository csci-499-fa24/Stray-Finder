const AnimalReport = require('../models/animalReport')
const Animal = require('../models/animal')
const User = require('../models/user')

/**
 * @get     : Retrieves list of animal reports
 * @route   : GET /api/animal-report
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
        let query = {}

        const fields = { animal, reportType, reportedBy }

        Object.keys(fields).forEach((key) => {
            if (fields[key]) {
                query[key] = fields[key].trim() // apply query filter if value exists
            }
        })

        const reports = await AnimalReport.find(query)
            .populate('animal')
            .populate({
                path: 'reportedBy',
                select: 'id username',
            })
            .exec()

        res.status(200).json({ reports })
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch animal reports',
            error: error.message,
        })
    }
}


/**
 * @post    : Creates a new animal report
 * @route   : POST /api/animal-report
 * @access  : public
 */
const createAnimalReport = async (req, res) => {
    try {
        const {
            name,
            species,
            breed,
            color,
            gender,
            fixed,
            collar,
            description,
            location,
            reportType,
            imageUrl,
            reportedBy,
        } = req.body

        // Check if all required animal fields are present
        if (!name || !species || !location || !reportType || !reportedBy) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        // Validate location structure
        if (
            !location.coordinates ||
            location.coordinates.type !== 'Point' ||
            !Array.isArray(location.coordinates.coordinates)
        ) {
            return res.status(400).json({ message: 'Invalid location format' })
        }

        // First, create the Animal record
        const animalData = {
            name,
            species,
            breed,
            color,
            gender,
            fixed,
            collar,
            description,
            imageUrl,
        }

        const animal = new Animal(animalData)
        await animal.save()

        // Create the Animal Report record with a reference to the newly created animal
        const reportData = {
            animal: animal._id, // Reference the created animal's ID
            location,
            reportType,
            description,
            reportedBy,
        }

        const animalReport = new AnimalReport(reportData)
        await animalReport.save()

        // Return the created report
        return res.status(201).json({
            message: 'Animal report created successfully',
            report: animalReport,
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to create animal report',
            error: error.message,
        })
    }
}

/**
 * @get     : Retrieves a specific animal report by ID
 * @route   : GET /api/animal-report/:id
 * @access  : public
 */
const getAnimalReportById = async (req, res) => {
    try {
        const { id } = req.params
        const report = await AnimalReport.findById(id)
            .populate('animal')
            .populate({
                path: 'reportedBy',
                select: 'id username',
            })
            .exec()

        if (!report) {
            return res.status(404).json({ message: 'Animal report not found' })
        }

        res.status(200).json({ report })
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch animal report',
            error: error.message,
        })
    }
}


/**
 * @put     : Updates an animal report by ID
 * @route   : PUT /api/animal-report/:id
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