const express = require('express')
const router = express.Router()
const {
    getAnimals,
    createAnimal,
    getAnimalById,
    updateAnimal,
    deleteAnimal,
} = require('../controllers/animal')
// const { authenticate } = require('../middleware/auth')

router.route('/').get(getAnimals).post(createAnimal) // add authentication middleware later

router
    .route('/:id')
    .get(getAnimalById)
    .put(updateAnimal) // add authentication middleware later
    .delete(deleteAnimal) // add authentication middleware later

module.exports = router;