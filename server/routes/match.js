const express = require('express')
const router = express.Router()
const { matchReports, getHighMatches } = require('../controllers/match')

router.get('/high', getHighMatches);

// POST /api/match - Compare two reports
router.get('/:id', matchReports)

module.exports = router
