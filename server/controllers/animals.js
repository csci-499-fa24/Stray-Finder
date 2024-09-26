const Animal = require('../models/animals')

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
        // Log comprehensive error details
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

        // Log the raw coordinates to see their structure
        console.log('Raw coordinates:', coordinates)

        // Check if coordinates are in the expected format
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
                    coordinates: coordinates.coordinates, // Use the coordinates from the request
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

module.exports = {
    getAnimals,
    createAnimal,
}
