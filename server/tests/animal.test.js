const request = require('supertest')
const express = require('express')
const cors = require('cors')
require('dotenv').config()

// In-memory Animal Model
class InMemoryAnimalModel {
    constructor() {
        this.animals = []
    }

    async create(animal) {
        this.animals.push(animal)
        return animal
    }

    async find() {
        return this.animals
    }

    async deleteMany() {
        this.animals = []
    }
}

// Create an instance of the in-memory model
const memoryAnimal = new InMemoryAnimalModel()

// Express app setup
const app = express()

// Middleware setup
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(
    cors({
        origin: process.env.NEXT_PUBLIC_CLIENT_URL,
    })
)

// Animal routes
app.use('/api/animal', (req, res) => {
    if (req.method === 'GET') {
        memoryAnimal.find().then((animals) => {
            res.json({ animals })
        })
    } else if (req.method === 'POST') {
        const newAnimal = req.body
        memoryAnimal.create(newAnimal).then((createdAnimal) => {
            res.status(201).json(createdAnimal)
        })
    }
})

// Jest tests
describe('GET /api/animal', () => {
    beforeEach(async () => {
        // Clear the in-memory database before each test
        await memoryAnimal.deleteMany()
    })

    it('should return a list of animals', async () => {
        // Create some mock data in the in-memory model
        const mockAnimal = {
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
        }

        // Insert the mock data into the in-memory model
        await memoryAnimal.create(mockAnimal)

        const response = await request(app).get('/api/animal')

        expect(response.status).toBe(200)
        expect(response.body.animals.length).toBe(1)
        expect(response.body.animals).toEqual([mockAnimal])
    })

    it('should return an empty array if no animals exist', async () => {
        const response = await request(app).get('/api/animal')

        expect(response.status).toBe(200)
        expect(response.body.animals).toEqual([])
    })
})