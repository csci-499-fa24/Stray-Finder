const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../server')
const AnimalReport = require('../models/animalReport')
const Animal = require('../models/animal')
const User = require('../models/user')

jest.setTimeout(30000)

// Mock the uploadImage function
jest.mock('../cloudinary/upload', () =>
    jest.fn().mockResolvedValue('http://mock-image-url.com')
)

describe('AnimalReport API', () => {
    let userId, animalId, reportId, token

    beforeAll(async () => {
        const url = process.env.MONGO_URI
        await mongoose.connect(url)

        // Register a test user
        await request(app).post('/auth/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'Password123!',
        })

        // Log in to get an authentication token
        const loginRes = await request(app).post('/auth/login').send({
            username: 'testuser',
            password: 'Password123!',
        })

        token = loginRes.headers['set-cookie'][0]
            .split(';')[0]
            .replace('token=', '')
        const user = await User.findOne({ email: 'testuser@example.com' })
        userId = user._id

        // Create a test animal
        const animal = await Animal.create({
            name: 'Buddy',
            species: 'Dog',
            gender: 'Male',
        })
        animalId = animal._id
    })

    afterEach(async () => {
        await AnimalReport.deleteMany({})
    })

    afterAll(async () => {
        await User.deleteMany({})
        await Animal.deleteMany({})
        await mongoose.connection.close()
    })

    it('POST /api/animal-report - should create a new animal report', async () => {
        const newReport = {
            name: 'Buddy',
            species: 'Dog',
            breed: 'Golden Retriever',
            color: 'Golden',
            gender: 'Male',
            fixed: 'Yes',
            collar: true,
            description: 'Friendly dog',
            location: JSON.stringify({
                address: '456 Avenue',
                coordinates: {
                    type: 'Point',
                    coordinates: [-73.935242, 40.73061],
                },
            }),
            reportType: 'Lost',
            reportedBy: userId.toString(),
        }

        const res = await request(app)
            .post('/api/animal-report')
            .set('Cookie', `token=${token}`)
            .send(newReport)

        expect(res.status).toBe(201)
        expect(res.body.message).toBe('Animal report created successfully')
        expect(res.body.report.reportType).toBe('Lost')
    })

    it('PUT /api/animal-report/:id - should update an existing report', async () => {
        const report = await AnimalReport.create({
            animal: animalId,
            location: {
                address: '123 Street',
                coordinates: {
                    type: 'Point',
                    coordinates: [-73.935242, 40.73061],
                },
            },
            reportType: 'Stray',
            description: 'A stray dog seen in the park',
            reportedBy: userId,
        })

        reportId = report._id

        const updatedReport = {
            location: JSON.stringify({
                address: '789 Boulevard',
                coordinates: {
                    type: 'Point',
                    coordinates: [-73.935242, 40.73061],
                },
            }),
            reportType: 'Found',
            description: 'Dog found in a different location',
        }

        const res = await request(app)
            .put(`/api/animal-report/${reportId}`)
            .set('Cookie', `token=${token}`)
            .send(updatedReport)

        expect(res.status).toBe(200)
        expect(res.body.report.reportType).toBe('Found')
        expect(res.body.report.description).toBe(
            'Dog found in a different location'
        )
    })

    it('DELETE /api/animal-report/:id - should delete an existing report', async () => {
        const report = await AnimalReport.create({
            animal: animalId,
            location: {
                address: '123 Street',
                coordinates: {
                    type: 'Point',
                    coordinates: [-73.935242, 40.73061],
                },
            },
            reportType: 'Lost',
            description: 'Dog lost near the park',
            reportedBy: userId,
        })

        reportId = report._id

        const res = await request(app)
            .delete(`/api/animal-report/${reportId}`)
            .set('Cookie', `token=${token}`)

        expect(res.status).toBe(200)
        expect(res.body.message).toBe('Animal report deleted successfully')

        const deletedReport = await AnimalReport.findById(reportId)
        expect(deletedReport).toBeNull()
    })
})
