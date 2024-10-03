const express = require('express')
const router = express.Router()
const {
    getStray,
    createStray,
    getStrayById,
    updateStray,
    deleteStray,
} = require('../controllers/stray')

// Define routes for stray
router
    .route('/')
    .get(getStray) // Retrieve all stray
    .post(createStray) // Create a new stray

router
    .route('/:id')
    .get(getStrayById) // Retrieve an stray by ID
    .put(updateStray) // Update an stray by ID
    .delete(deleteStray) // Delete an stray by ID

module.exports = router