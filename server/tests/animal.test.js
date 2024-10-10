const request = require('supertest')
const express = require('express')
const cors = require('cors')
const animalsRouter = require('../routes/animal')
const Animal = require('../models/animal') // This will be mocked
const app = express()
require('dotenv').config()

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
            // ... add other mock animals
        ]

        // Mock the return value of the find method
        Animal.find.mockResolvedValue(mockAnimals)

        const response = await request(app).get('/api/animal')

        expect(response.status).toBe(200)
        expect(response.body.animals.length).toBe(mockAnimals.length)
        expect(response.body.animals).toEqual(mockAnimals) // Optional: Check response body
    })

    it('should return an empty array if no animals exist', async () => {
        // Mock the return value for no animals
        Animal.find.mockResolvedValue([])

        const response = await request(app).get('/api/animal')

        expect(response.status).toBe(200)
        expect(response.body.animals).toEqual([])
    })
})