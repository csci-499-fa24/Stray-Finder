const AnimalReport = require('../models/animalReport')
const Animal = require('../models/animal')
const uploadImage = require('../cloudinary/upload')
const upload = require('../middleware/uploadMiddleware')
// const {createOrUpdateFeatureVector} = require('../utils/FeatureVectorUtils')

// GET: Retrieve list of animal reports
const getAnimalReports = async (req, res) => {
    try {
        const { reportType, gender, species, reportedBy } = req.query;
        let query = {};

        if (reportType) query.reportType = reportType;

        if (reportedBy) {
            query.reportedBy = reportedBy; // Ensure this is included for filtering
        }

        let animalQuery = {};
        if (gender) animalQuery.gender = gender;
        if (species) animalQuery.species = species;

        if (Object.keys(animalQuery).length > 0) {
            const animals = await Animal.find(animalQuery).select('_id');
            const animalIds = animals.map((animal) => animal._id);
            query.animal = { $in: animalIds };
        }

        const reports = await AnimalReport.find(query)
            .populate('animal')
            .populate('reportedBy')
            .exec();

        res.status(200).json({ reports });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch animal reports',
            error: error.message,
        });
    }
};


// GET: Retrieves a specific animal report by ID
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


// POST: Creates a new animal report
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
            reportedBy,
        } = req.body

        if (!species || !location || !reportType || !reportedBy) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        let parsedLocation
        try {
            parsedLocation = JSON.parse(location)
        } catch (jsonError) {
            return res
                .status(400)
                .json({
                    message: 'Invalid location format',
                    error: jsonError.message,
                })
        }

        let imageUrl = null
        if (req.file) {
            imageUrl = await uploadImage(req.file)
        }

        let animal
        if (reportType === 'Found') {
            animal = await Animal.findOne({ species, breed, color, gender })
            if (!animal) {
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
                animal = new Animal(animalData)
                await animal.save()
            }
        } else {
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
            animal = new Animal(animalData)
            await animal.save()
        }

        // if (imageUrl) {
        //     await createOrUpdateFeatureVector(animal._id, imageUrl);
        // }

        const reportData = {
            animal: animal._id,
            location: parsedLocation,
            reportType,
            description,
            reportedBy,
        }
        const animalReport = new AnimalReport(reportData)
        await animalReport.save()

        res.status(201).json({
            message: 'Animal report created successfully',
            report: animalReport,
        })
    } catch (error) {
        console.error('Error creating animal report:', error)
        res.status(500).json({
            message: 'Failed to create animal report',
            error,
        })
    }
}

// PUT: Updates an animal report by ID
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

        // if (imageUrl) {
        //     await createOrUpdateFeatureVector(report.animal._id, imageUrl)
        //     await Animal.findByIdAndUpdate(report.animal._id, { imageUrl })
        // }

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
        const { id } = req.params

        const deletedReport = await AnimalReport.findByIdAndDelete(id)

        if (!deletedReport) {
            return res.status(404).json({ message: 'Animal report not found' })
        }

        const animalId = deletedReport.animal

        const otherReports = await AnimalReport.find({ animal: animalId })

        if (otherReports.length === 0) {
            await Animal.findByIdAndDelete(animalId)
            // await FeatureVector.findOneAndDelete({ animalId });
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
