const express = require('express')
const router = express.Router()
const {sendEmail, fetchAllRecentAnimals} = require('../controllers/email')

router.post('/:targetEmail', sendEmail)

module.exports = router