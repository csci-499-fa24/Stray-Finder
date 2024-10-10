const request = require('supertest')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const animalsRouter = require('../routes/animals') // Adjust the path as needed
const Animal = require('../models/animals') // Adjust the path as needed
const connectDB = require('../db/connect') // Adjust the path as needed
require('dotenv').config()

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(
    cors({
        origin: process.env.NEXT_PUBLIC_CLIENT_URL, // Update as needed
    })
)
app.use('/api/animal', animalsRouter)

describe('GET /api/animal', () => {
    jest.setTimeout(10000) // Set timeout to 10 seconds

    beforeAll(async () => {
        // Connect to your test database
        await connectDB(process.env.MONGO_URI) // Use a separate test URI
    })

    afterAll(async () => {
        // Disconnect from the database after tests are done
        await mongoose.disconnect()
    })

    beforeEach(async () => {
        // Clear the animals collection before each test
        await Animal.deleteMany({})
    })

    it('should return a list of animals', async () => {
        const response = await request(app).get('/api/animal')

        expect(response.status).toBe(200)
    })

    it('should return an empty array if no animals exist', async () => {
        const response = await request(app).get('/api/animal')

        expect(response.status).toBe(200)
        expect(response.body.animals).toEqual([])
    })
})
