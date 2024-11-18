const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../server')
const Animal = require('../models/animal')
require('dotenv').config({ path: '.env.test' })


// Mock uploadImage function
jest.mock('../cloudinary/upload', () =>
    jest.fn().mockResolvedValue('http://mock-image-url.com')
)

// Mock middleware
const authenticate = require('../middleware/auth')
jest.mock('../middleware/auth', () => (req, res, next) => next())

describe('Animal API', () => {
    let animalId

    // Setup database connection before running tests
    beforeAll(async () => {
        const url = process.env.MONGO_URI
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    })

    // Clear database after each test
    afterEach(async () => {
        await Animal.deleteMany()
    })

    // Close database connection after all tests
    afterAll(async () => {
        await mongoose.connection.close()
    })

    it('GET /api/animal - should return all animals based on query', async () => {
        // Create some animals
        await Animal.create([
            { name: 'Buddy', species: 'Dog', gender: 'Male' },
            { name: 'Whiskers', species: 'Cat', gender: 'Female' },
        ])

        const res = await request(app)
            .get('/api/animal')
            .query({ species: 'Dog' })
        expect(res.status).toBe(200)
        expect(res.body.animals.length).toBe(1)
        expect(res.body.animals[0].name).toBe('Buddy')
    })

    it('GET /api/animal/:id - should return an animal by ID', async () => {
        const animal = await Animal.create({
            name: 'Buddy',
            species: 'Dog',
            gender: 'Male',
        })
        animalId = animal._id

        const res = await request(app).get(`/api/animal/${animalId}`)
        expect(res.status).toBe(200)
        expect(res.body.animal.name).toBe('Buddy')
    })

    it('PUT /api/animal/:id - should update an animal by ID', async () => {
        const animal = await Animal.create({
            name: 'Buddy',
            species: 'Dog',
            gender: 'Male',
        })
        animalId = animal._id

        const res = await request(app)
            .put(`/api/animal/${animalId}`)
            .send({ name: 'Buddy Updated' })

        expect(res.status).toBe(200)
        expect(res.body.animal.name).toBe('Buddy Updated')
    })

    it('DELETE /api/animal/:id - should delete an animal by ID', async () => {
        const animal = await Animal.create({
            name: 'Buddy',
            species: 'Dog',
            gender: 'Male',
        })
        animalId = animal._id

        const res = await request(app).delete(`/api/animal/${animalId}`)
        expect(res.status).toBe(200)
        expect(res.body.message).toBe('Animal deleted successfully')

        const deletedAnimal = await Animal.findById(animalId)
        expect(deletedAnimal).toBeNull()
    })
})
