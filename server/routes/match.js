const express = require('express')
const router = express.Router()
const { matchReports } = require('../controllers/match')

// POST /api/match - Compare two reports
router.get('/:id', matchReports)

module.exports = router
