const Animal = require('../models/animal')
const { uploadImage } = require('../cloudinary/utils')
const { extractPublicId } = require('../cloudinary/utils')
const cloudinary = require('cloudinary').v2
require('dotenv').config()

// GET: Retrieve all animals based on query parameters
const getAnimals = async (req, res) => {
    try {
        const { name, species, breed, color, gender, fixed, collar } = req.query
        let query = {}
        const fields = { name, species, breed, color, gender, fixed, collar }
        Object.keys(fields).forEach((key) => {
            if (fields[key]) query[key] = fields[key].trim()
        })

        const animals = await Animal.find(query)
        res.status(200).json({ animals })
    } catch (error) {
        console.error('Error fetching animals:', error.message)
        res.status(500).json({ message: 'Failed to fetch animals' })
    }
}

// GET: Retrieve a single animal by ID
const getAnimalById = async (req, res) => {
    try {
        const { id } = req.params
        const animal = await Animal.findById(id)

        if (!animal)
            return res.status(404).json({ message: 'Animal not found' })

        res.status(200).json({ animal })
    } catch (error) {
        console.error('Error fetching animal by ID:', error.message)
        res.status(500).json({ message: 'Failed to fetch animal' })
    }
}

// PUT: Update an animal by ID
const updateAnimal = async (req, res) => {
    try {
        const { id } = req.params
        let newImageUrl = null

        if (req.file) {
            newImageUrl = await uploadImage(req.file)
        }

        const animal = await Animal.findById(id)
        if (!animal)
            return res.status(404).json({ message: 'Animal not found' })

        const fieldsToUpdate = [
            'name',
            'species',
            'breed',
            'color',
            'gender',
            'fixed',
            'collar',
            'description',
        ]
        fieldsToUpdate.forEach((field) => {
            if (req.body[field] !== undefined) animal[field] = req.body[field]
        })

        if (newImageUrl) {
            animal.imageUrl = newImageUrl
            // Optionally, update associated feature vectors here.
        }

        const updatedAnimal = await animal.save()
        res.status(200).json({ animal: updatedAnimal })
    } catch (error) {
        console.error('Error updating animal:', error.message)
        res.status(500).json({ message: 'Failed to update animal' })
    }
}

// DELETE: Delete an animal by ID and remove its Cloudinary image
const deleteAnimal = async (req, res) => {
    try {
        const { id } = req.params
        const deletedAnimal = await Animal.findByIdAndDelete(id)

        if (!deletedAnimal)
            return res.status(404).json({ message: 'Animal not found' })

        // If the deleted animal has an imageUrl, attempt to delete the Cloudinary asset.
        if (deletedAnimal.imageUrl) {
            const publicId = extractPublicId(deletedAnimal.imageUrl)
            if (publicId) {
                const deletionResult = await cloudinary.uploader.destroy(
                    publicId
                )
                console.log(
                    `Deleted Cloudinary asset ${publicId}:`,
                    deletionResult
                )
            } else {
                console.warn(
                    'Could not extract publicId from imageUrl:',
                    deletedAnimal.imageUrl
                )
            }
        }

        // Optionally: delete any related feature vectors or other associated data.

        res.status(200).json({
            message: 'Animal deleted successfully',
            animal: deletedAnimal,
        })
    } catch (error) {
        console.error('Error deleting animal:', error.message)
        res.status(500).json({
            message: 'Failed to delete animal',
            error: error.message,
        })
    }
}

module.exports = {
    getAnimals,
    getAnimalById,
    updateAnimal,
    deleteAnimal,
}
