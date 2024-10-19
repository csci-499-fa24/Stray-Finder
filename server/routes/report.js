const express = require('express');
const router = express.Router();
const { createReport, updateReport, deleteReport, getReports } = require('../controllers/report');
const authenticate = require('../middleware/auth');

// Create a new report
router.post('/', authenticate, createReport);

// Get reports for the authenticated user
router.get('/', authenticate, getReports);  // This will be filtered by userId

// Update an existing report
router.put('/:id', authenticate, updateReport);

// Delete a report
router.delete('/:id', authenticate, deleteReport);

module.exports = router;
