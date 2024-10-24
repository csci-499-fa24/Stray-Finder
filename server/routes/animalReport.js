const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/auth')
const {
    getAnimalReports,
    createAnimalReport,
    getAnimalReportById,
    updateAnimalReport,
    deleteAnimalReport,
} = require('../controllers/animalReport')

router.route('/').get(getAnimalReports).post(authenticate, createAnimalReport)

router
    .route('/:id')
    .get(getAnimalReportById)
    .put(authenticate, updateAnimalReport)
    .delete(authenticate, deleteAnimalReport)

module.exports = router;