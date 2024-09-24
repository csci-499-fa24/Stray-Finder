const express = require('express')
const router = express.Router()
const { getAnimals, createAnimal} = require('../controllers/animals')

router
    .route('/')
    .get(getAnimals)
    .post(createAnimal)

module.exports = router