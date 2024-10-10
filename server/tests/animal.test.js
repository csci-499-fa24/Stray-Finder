const request = require('supertest')
const express = require('express')
const cors = require('cors')
const animalsRouter = require('../routes/animal')
const Animal = require('../models/animal')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
require('dotenv').config()

const app = express()
let mongoServer

// Middleware setup
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(
    cors({
        origin: process.env.NEXT_PUBLIC_CLIENT_URL,
    })
)
app.use('/api/animal', animalsRouter)

// Mock the Animal model
jest.mock('../models/animal')

describe('GET /api/animal', () => {
    jest.setTimeout(10000) // Set timeout to 10 seconds

    beforeAll(async () => {
        // Start MongoDB Memory Server
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        // Connect to the in-memory database
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    })

    afterAll(async () => {
        // Clean up and close the database connection
        await mongoose.disconnect()
        await mongoServer.stop()
    })

    beforeEach(() => {
        // Clear all instances and calls to the mocked Animal model
        Animal.create.mockClear()
        Animal.find.mockClear()
    })

    it('should return a list of animals', async () => {
        // Create some mock data
        const mockAnimals = [
            {
                name: 'Bella',
                species: 'Dog',
                breed: 'Golden Retriever',
                color: 'Golden',
                gender: 'Female',
                description: 'A friendly and playful dog.',
                imageUrl: 'https://example.com/images/bella.jpg',
                coordinates: {
                    type: 'Point',
                    coordinates: [-74.006, 40.7128],
                },
            },
        ]

        // Mock the return value of the find method
        Animal.find.mockResolvedValue(mockAnimals)

        const response = await request(app).get('/api/animal')

        expect(response.status).toBe(200)
        expect(response.body.animals.length).toBe(mockAnimals.length)
        expect(response.body.animals).toEqual(mockAnimals)
    })

    it('should return an empty array if no animals exist', async () => {
        // Mock the return value for no animals
        Animal.find.mockResolvedValue([])

        const response = await request(app).get('/api/animal')

        expect(response.status).toBe(200)
        expect(response.body.animals).toEqual([])
    })
})