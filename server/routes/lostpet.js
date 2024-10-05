const express = require('express')
const router = express.Router()
const {
    getLostPet,
    createLostPet,
    getLostPetById,
    updateLostPet,
    deleteLostPet,

} = require('../controllers/lostpet')

// Define routes for stray
router
    .route('/')
    .get(getLostPet) // Retrieve all stray
    .post(createLostPet) // Create a new stray

router
    .route('/:id')
    .get(getLostPetById) // Retrieve an stray by ID
    .put(updateLostPet) // Update an stray by ID
    .delete(deleteLostPet) // Delete an stray by ID

module.exports = router