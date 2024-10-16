const Animal = require('../models/animal')

/**
 * @post   : Retrieves list of animal data
 * @route  : GET /api/animal
 * @access : public
 */
const getAnimals = async (req, res) => {
    try {
        const animals = await Animal.find()
        res.status(200).json({ animals })
    } catch (error) {
        console.error('Error fetching animals:', {
            message: error.message,
            stack: error.stack,
            request: {
                headers: req.headers,
                body: req.body,
                query: req.query,
            },
        })
        res.status(500).json({
            message: 'Failed to fetch animals',
            error: error.message,
        })
    }
}

/**
 * @post    : Creates animal data instance
 * @route   : POST /api/animal
 * @access  : public (at the moment)
 */
const createAnimal = async (req, res) => {
    try {
        const { coordinates, ...rest } = req.body

        if (
            coordinates &&
            coordinates.type === 'Point' &&
            Array.isArray(coordinates.coordinates) &&
            coordinates.coordinates.length === 2
        ) {
            const formattedAnimal = {
                ...rest,
                coordinates: {
                    type: 'Point',
                    coordinates: coordinates.coordinates,
                },
            }

            const animal = await Animal.create(formattedAnimal)
            res.status(201).json({ animal })
        } else {
            throw new Error('Coordinates are missing or incorrectly formatted')
        }
    } catch (error) {
        console.error('Error creating animal:', error.message)
        res.status(500).json({
            message: 'Failed to create animal',
            error: error.message,
        })
    }
}

/**
 * @get     : Retrieves a specific animal by ID
 * @route   : GET /api/animal/:id
 * @access  : public
 */
const getAnimalById = async (req, res) => {
    try {
        const { id } = req.params
        const animal = await Animal.findById(id)

        if (!animal) {
            return res.status(404).json({ message: 'Animal not found' })
        }

        res.status(200).json({ animal })
    } catch (error) {
        console.error('Error fetching animal by ID:', error.message)
        res.status(500).json({
            message: 'Failed to fetch animal',
            error: error.message,
        })
    }
}

/**
 * @put     : Updates an animal by ID
 * @route   : PUT /api/animal/:id
 * @access  : public
 */
const updateAnimal = async (req, res) => {
    try {
        const { id } = req.params
        const { coordinates, ...rest } = req.body

        if (coordinates) {
            if (
                coordinates.type === 'Point' &&
                Array.isArray(coordinates.coordinates) &&
                coordinates.coordinates.length === 2
            ) {
                rest.coordinates = {
                    type: 'Point',
                    coordinates: coordinates.coordinates,
                }
            } else {
                throw new Error('Coordinates are incorrectly formatted')
            }
        }

        const updatedAnimal = await Animal.findByIdAndUpdate(id, rest, {
            new: true,
        })

        if (!updatedAnimal) {
            return res.status(404).json({ message: 'Animal not found' })
        }

        res.status(200).json({ animal: updatedAnimal })
    } catch (error) {
        console.error('Error updating animal:', error.message)
        res.status(500).json({
            message: 'Failed to update animal',
            error: error.message,
        })
    }
}

/**
 * @delete  : Deletes an animal by ID
 * @route   : DELETE /api/animal/:id
 * @access  : public
 */
const deleteAnimal = async (req, res) => {
    try {
        const { id } = req.params
        const deletedAnimal = await Animal.findByIdAndDelete(id)

        if (!deletedAnimal) {
            return res.status(404).json({ message: 'Animal not found' })
        }

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
    createAnimal,
    getAnimalById,
    updateAnimal,
    deleteAnimal,
}