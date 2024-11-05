const AnimalReport = require('../models/animalReport')
const Animal = require('../models/animal')
const FeatureVector = require('../models/FeatureVector')
const User = require('../models/user')
const uploadImage = require('../cloudinary/upload')
const upload = require('../middleware/uploadMiddleware')
const {createOrUpdateFeatureVector} = require('../utils/FeatureVectorUtils')

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
        const { animal, reportType, reportedBy } = req.query;
        let query = {};
        const fields = { animal, reportType, reportedBy };
        Object.keys(fields).forEach((key) => {
            if (fields[key]) query[key] = fields[key].trim();
        });

        const reports = await AnimalReport.find(query).populate('animal').populate('reportedBy').exec();
        res.status(200).json({ reports });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch animal reports', error: error.message });
    }
};

// POST: Creates a new animal report
const createAnimalReport = async (req, res) => {
    try {
        const { name, species, breed, color, gender, fixed, collar, description, location, reportType, reportedBy } = req.body;

        if (!name || !species || !location || !reportType || !reportedBy) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadImage(req.file);
        }

        const animalData = { name, species, breed, color, gender, fixed, collar, description, imageUrl };
        const animal = new Animal(animalData);
        await animal.save();

        if (imageUrl) {
            await createOrUpdateFeatureVector(animal._id, imageUrl);
        }

        const reportData = {
            animal: animal._id,
            location: JSON.parse(location),
            reportType,
            description,
            reportedBy,
        };
        const animalReport = new AnimalReport(reportData);
        await animalReport.save();

        res.status(201).json({ message: 'Animal report created successfully', report: animalReport });
    } catch (error) {
        console.error('Error creating animal report:', error.message);
        res.status(500).json({ message: 'Failed to create animal report', error: error.message });
    }
};

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
            .populate('reportedBy')
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
        let imageUrl = null

        if (req.file) {
            imageUrl = await uploadImage(req.file)
        }

        const report = await AnimalReport.findById(id).populate('animal')
        if (!report)
            return res.status(404).json({ message: 'Animal report not found' })

        if (imageUrl) {
            await createOrUpdateFeatureVector(report.animal._id, imageUrl)
            await Animal.findByIdAndUpdate(report.animal._id, { imageUrl })
        }

        const updatedReport = await AnimalReport.findByIdAndUpdate(
            id,
            { location: JSON.parse(location), reportType, description },
            { new: true }
        )
        res.status(200).json({ report: updatedReport })
    } catch (error) {
        console.error('Error updating animal report:', error.message)
        res.status(500).json({
            message: 'Failed to update animal report',
            error: error.message,
        })
    }
}

// DELETE: Deletes an animal report by ID
const deleteAnimalReport = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the report to be deleted
        const deletedReport = await AnimalReport.findByIdAndDelete(id);
        
        if (!deletedReport) {
            return res.status(404).json({ message: 'Animal report not found' });
        }

        const animalId = deletedReport.animal;

        // Check if this animal is referenced in any other reports
        const otherReports = await AnimalReport.find({ animal: animalId });
        
        // If there are no other reports referencing this animal, delete the animal
        if (otherReports.length === 0) {
            await Animal.findByIdAndDelete(animalId);
            await FeatureVector.findOneAndDelete({ animalId });
        }

        res.status(200).json({
            message: 'Animal report deleted successfully',
            report: deletedReport,
        });
    } catch (error) {
        console.error('Error deleting animal report:', error.message);
        res.status(500).json({
            message: 'Failed to delete animal report',
            error: error.message,
        });
    }
};


module.exports = {
    getAnimalReports,
    createAnimalReport,
    getAnimalReportById,
    updateAnimalReport,
    deleteAnimalReport,
}