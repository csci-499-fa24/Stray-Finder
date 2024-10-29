const express = require('express')
const router = express.Router()
const upload = require('../middleware/uploadMiddleware')
const {
    getAnimals,
    createAnimal,
    getAnimalById,
    updateAnimal,
    deleteAnimal,
} = require('../controllers/animal')
const authenticate = require('../middleware/auth')

router.route('/').get(getAnimals)

router
    .route('/:id')
    .get(getAnimalById)
    .put(authenticate, upload.single('image'), updateAnimal)
    .delete(authenticate, deleteAnimal)

module.exports = router
