const Stray = require('../models/lostpet');

/**
 * @post   : Retrieves list of stray data
 * @route  : GET /api/stray
 * @access : public
 */
const getLostPet = async (req, res) => {
    try {
        const stray = await Stray.find()
        res.status(200).json({ stray })
    } catch (error) {
        console.error('Error fetching strays:', {
            message: error.message,
            stack: error.stack,
            request: {
                headers: req.headers,
                body: req.body,
                query: req.query,
            },
        })
        res.status(500).json({
            message: 'Failed to fetch strays',
            error: error.message,
        })
    }
}

/**
 * @post    : Creates stray data instance
 * @route   : POST /api/stray
 * @access  : public (at the moment)
 */
const createLostPet = async (req, res) => {
    try {
        const { coordinates, ...rest } = req.body

        // Log the raw coordinates to see their structure
        console.log('Raw coordinates:', coordinates)

        if (
            coordinates &&
            coordinates.type === 'Point' &&
            Array.isArray(coordinates.coordinates) &&
            coordinates.coordinates.length === 2
        ) {
            const formattedStray = {
                ...rest,
                coordinates: {
                    type: 'Point',
                    coordinates: coordinates.coordinates,
                },
            }

            const stray = await Stray.create(formattedStray)
            res.status(201).json({ stray })
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
 * @get     : Retrieves a specific stray by ID
 * @route   : GET /api/stray/:id
 * @access  : public
 */
const getLostPetById = async (req, res) => {
    try {
        const { id } = req.params
        const stray = await Stray.findById(id)

        if (!stray) {
            return res.status(404).json({ message: 'Stray not found' })
        }

        res.status(200).json({ stray })
    } catch (error) {
        console.error('Error fetching stray by ID:', error.message)
        res.status(500).json({
            message: 'Failed to fetch stray',
            error: error.message,
        })
    }
}

/**
 * @put     : Updates an stray by ID
 * @route   : PUT /api/stray/:id
 * @access  : public
 */
const updateLostPet = async (req, res) => {
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

        const updatedStray = await Stray.findByIdAndUpdate(id, rest, {
            new: true,
        })

        if (!updatedStray) {
            return res.status(404).json({ message: 'Stray not found' })
        }

        res.status(200).json({ stray: updatedStray })
    } catch (error) {
        console.error('Error updating animal:', error.message)
        res.status(500).json({
            message: 'Failed to update animal',
            error: error.message,
        })
    }
}

/**
 * @delete  : Deletes an stray by ID
 * @route   : DELETE /api/stray/:id
 * @access  : public
 */
const deleteLostPet = async (req, res) => {
    try {
        const { id } = req.params
        const deletedStray = await Stray.findByIdAndDelete(id)

        if (!deletedStray) {
            return res.status(404).json({ message: 'Stray not found' })
        }

        res.status(200).json({
            message: 'Stray deleted successfully',
            stray: deletedStray,
        })
    } catch (error) {
        console.error('Error deleting stray:', error.message)
        res.status(500).json({
            message: 'Failed to delete stray',
            error: error.message,
        })
    }
}

module.exports = {
    getLostPet,
    createLostPet,
    getLostPetById,
    updateLostPet,
    deleteLostPet,
}