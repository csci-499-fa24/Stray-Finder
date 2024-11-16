const express = require('express')
const router = express.Router()
const {sendEmail, sendReportsEmail, fetchAllRecentAnimals} = require('../controllers/email')

router.post('/:targetEmail', sendReportsEmail)

module.exports = router