const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../server') // Ensure this points to your actual server/app instance
const Animal = require('../models/animal') // Actual Mongoose model

describe('Animal API', () => {
    beforeAll(async () => {
        await Animal.deleteMany()
    })

    afterEach(async () => {
        await Animal.deleteMany()
    })

    describe('GET /api/animal', () => {
        it('should return a list of animals', async () => {
            await Animal.create({
                name: 'Bella',
                species: 'Dog',
                breed: 'Golden Retriever',
            })
            const response = await request(app).get('/api/animal')
            expect(response.status).toBe(200)
            expect(response.body.animals.length).toBe(1)
            expect(response.body.animals[0].name).toBe('Bella')
        })

        it('should return an empty array if no animals exist', async () => {
            const response = await request(app).get('/api/animal')
            expect(response.status).toBe(200)
            expect(response.body.animals).toEqual([])
        })
    })

    describe('GET /api/animal/:id', () => {
        it('should return a single animal by ID', async () => {
            const animal = await Animal.create({
                name: 'Charlie',
                species: 'Cat',
                gender: 'Male',
            })
            const response = await request(app).get(`/api/animal/${animal._id}`)
            expect(response.status).toBe(200)
            expect(response.body.animal.name).toEqual('Charlie')
        })

        it('should return 404 if animal is not found', async () => {
            const response = await request(app).get('/api/animal/invalid-id')
            expect(response.status).toBe(404)
            expect(response.body.message).toBe('Animal not found')
        })
    })

    // Similar updates for PUT and DELETE tests
})