const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/auth')
const upload = require('../middleware/uploadMiddleware')
const {
    getAnimalReports,
    createAnimalReport,
    getAnimalReportById,
    updateAnimalReport,
    deleteAnimalReport,
    getAnimalReportByUserId,
} = require('../controllers/animalReport')

router
    .route('/')
    .get(getAnimalReports)
    .post(authenticate, upload.single('image'), createAnimalReport)

router
    .route('/:id')
    .get(getAnimalReportById)
    .put(authenticate, upload.single('image'), updateAnimalReport)
    .delete(authenticate, deleteAnimalReport)

// router
//     .route('/UserID/:id')
//     .get(getAnimalReportByUserId)

module.exports = router
