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
        console.error('Error fetching animals:', error.message)
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

        // Format the coordinates to match the GeoJSON format
        const formattedAnimal = {
            ...rest,
            coordinates: {
                type: 'Point',
                coordinates: [coordinates.lng, coordinates.lat], // [lng, lat] order for GeoJSON
            },
        }

        const animal = await LostPet.create(formattedAnimal)
        res.status(201).json({ animal })
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
