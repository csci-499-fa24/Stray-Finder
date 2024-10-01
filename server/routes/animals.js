const express = require('express')
const router = express.Router()
const {
    getAnimals,
    createAnimal,
    getAnimalById,
    updateAnimal,
    deleteAnimal,
} = require('../controllers/animals')

// Define routes for animals
router
    .route('/')
    .get(getAnimals) // Retrieve all animals
    .post(createAnimal) // Create a new animal

router
    .route('/:id')
    .get(getAnimalById) // Retrieve an animal by ID
    .put(updateAnimal) // Update an animal by ID
    .delete(deleteAnimal) // Delete an animal by ID

module.exports = router