const express = require('express')
const router = express.Router()
const { matchReports } = require('../controllers/match')

// POST /api/match - Compare two reports
router.post('/', matchReports)

module.exports = router
