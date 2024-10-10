const request = require('supertest')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const animalsRouter = require('../routes/animal')
const Animal = require('../models/animal')
const { MongoMemoryServer } = require('mongodb-memory-server')
require('dotenv').config()

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(
    cors({
        origin: process.env.NEXT_PUBLIC_CLIENT_URL,
    })
)
app.use('/api/animal', animalsRouter)

let mongoServer

describe('GET /api/animal', () => {
    jest.setTimeout(10000) // Set timeout to 10 seconds

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)
    })

    afterAll(async () => {
        // Disconnect from the database after tests are done
        await mongoose.disconnect()
        await mongoServer.stop()
    })

    beforeEach(async () => {
        // Clear the animals collection before each test
        await Animal.deleteMany({})
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
                    coordinates: [-74.006, 40.7128], // Longitude, Latitude (example coordinates for New York)
                },
                dateReported: new Date('2024-09-15T10:00:00Z'),
            },
            {
                name: 'Max',
                species: 'Dog',
                breed: 'Bulldog',
                color: 'Brindle',
                gender: 'Male',
                description: 'A strong and loyal companion.',
                imageUrl: 'https://example.com/images/max.jpg',
                coordinates: {
                    type: 'Point',
                    coordinates: [-73.935242, 40.73061], // Longitude, Latitude (example coordinates for NYC)
                },
                dateReported: new Date('2024-09-16T12:30:00Z'),
            },
            {
                name: 'Whiskers',
                species: 'Cat',
                breed: 'Siamese',
                color: 'Cream',
                gender: 'Male',
                description: 'A curious and affectionate cat.',
                imageUrl: 'https://example.com/images/whiskers.jpg',
                coordinates: {
                    type: 'Point',
                    coordinates: [-73.9836, 40.7478], // Longitude, Latitude (example coordinates for NYC)
                },
                dateReported: new Date('2024-09-17T14:00:00Z'),
            },
            {
                name: 'Luna',
                species: 'Cat',
                breed: 'Maine Coon',
                color: 'Gray',
                gender: 'Female',
                description: 'A gentle giant with a sweet temperament.',
                imageUrl: 'https://example.com/images/luna.jpg',
                coordinates: {
                    type: 'Point',
                    coordinates: [-73.9822, 40.758], // Longitude, Latitude (example coordinates for NYC)
                },
                dateReported: new Date('2024-09-18T09:15:00Z'),
            },
            {
                name: 'Charlie',
                species: 'Rabbit',
                breed: 'Holland Lop',
                color: 'White',
                gender: 'Male',
                description: 'A playful rabbit that loves to hop around.',
                imageUrl: 'https://example.com/images/charlie.jpg',
                coordinates: {
                    type: 'Point',
                    coordinates: [-73.9815, 40.7468], // Longitude, Latitude (example coordinates for NYC)
                },
                dateReported: new Date('2024-09-19T11:45:00Z'),
            },
        ]

        await Animal.create(mockAnimals);

        const response = await request(app).get('/api/animal')

        expect(response.status).toBe(200)
        expect(response.body.animals.length).toBe(5)
    })

    it('should return an empty array if no animals exist', async () => {
        const response = await request(app).get('/api/animal')

        expect(response.status).toBe(200)
        expect(response.body.animals).toEqual([])
    })
})