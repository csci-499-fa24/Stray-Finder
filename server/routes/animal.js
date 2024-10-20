const express = require('express')
const router = express.Router()
const {
    getAnimals,
    createAnimal,
    getAnimalById,
    updateAnimal,
    deleteAnimal,
} = require('../controllers/animal')
const authenticate = require('../middleware/auth')

router.route('/').get(getAnimals).post(authenticate, createAnimal)

router
    .route('/:id')
    .get(getAnimalById)
    .put(authenticate, updateAnimal)
    .delete(authenticate, deleteAnimal)

module.exports = router
