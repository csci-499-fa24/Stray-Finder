const express = require('express')
const router = express.Router()
const {
    getAnimals,
    createAnimal,
    getAnimalById,
    updateAnimal,
    deleteAnimal,
} = require('../controllers/animals')
const { authenticate } = require('../middleware/authenticate')

// Define routes for animals
router
    .route('/')
    .get(getAnimals)
    .post(createAnimal)  // add authentication middleware later
router
    .route('/:id')
    .get(getAnimalById)
    .put(updateAnimal) // add authentication middleware later
    .delete(deleteAnimal) // add authentication middleware later

module.exports = router