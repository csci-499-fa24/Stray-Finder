const request = require('supertest')
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

// In-memory models for Animal and User dependencies
class InMemoryModel {
    constructor() {
        this.items = []
        this.currentId = 1
    }

    async create(itemData) {
        const newItem = { id: this.currentId++, ...itemData }
        this.items.push(newItem)
        return newItem
    }

    async findById(id) {
        return this.items.find((item) => item.id === id)
    }

    async find(query = {}) {
        return this.items.filter((item) =>
            Object.keys(query).every((key) => item[key] === query[key])
        )
    }

    async findByIdAndUpdate(id, updateData) {
        const item = this.items.find((item) => item.id === id)
        if (item) {
            Object.assign(item, updateData)
            return item
        }
        return null
    }

    async findByIdAndDelete(id) {
        const index = this.items.findIndex((item) => item.id === id)
        if (index !== -1) {
            return this.items.splice(index, 1)[0]
        }
        return null
    }

    async deleteMany() {
        this.items = []
    }
}

// Initialize in-memory models
const memoryAnimal = new InMemoryModel()
const memoryUser = new InMemoryModel()
const memoryAnimalReport = new InMemoryModel()

// Express app setup
const app = express()
app.use(express.json())
app.use(cors({ origin: process.env.NEXT_PUBLIC_CLIENT_URL }))

// Routes for AnimalReport CRUD
app.get('/api/animal-report', async (req, res) => {
    const reports = await memoryAnimalReport.find(req.query)
    res.status(200).json({ reports })
})

app.get('/api/animal-report/:id', async (req, res) => {
    const report = await memoryAnimalReport.findById(Number(req.params.id))
    if (report) {
        res.status(200).json({ report })
    } else {
        res.status(404).json({ message: 'Animal report not found' })
    }
})

app.post('/api/animal-report', async (req, res) => {
    const { animal, location, reportType, description, reportedBy } = req.body

    // Verify references
    const animalExists = await memoryAnimal.findById(animal)
    const userExists = await memoryUser.findById(reportedBy)
    if (!animalExists || !userExists) {
        return res
            .status(400)
            .json({ message: 'Invalid animal or user reference' })
    }

    const newReport = await memoryAnimalReport.create({
        animal,
        location,
        reportType,
        description,
        reportedBy,
    })
    res.status(201).json(newReport)
})

app.put('/api/animal-report/:id', async (req, res) => {
    const updatedReport = await memoryAnimalReport.findByIdAndUpdate(
        Number(req.params.id),
        req.body
    )
    if (updatedReport) {
        res.status(200).json({ report: updatedReport })
    } else {
        res.status(404).json({ message: 'Animal report not found' })
    }
})

app.delete('/api/animal-report/:id', async (req, res) => {
    const deletedReport = await memoryAnimalReport.findByIdAndDelete(
        Number(req.params.id)
    )
    if (deletedReport) {
        res.status(200).json({
            message: 'Animal report deleted successfully',
            report: deletedReport,
        })
    } else {
        res.status(404).json({ message: 'Animal report not found' })
    }
})

// Jest Tests for AnimalReport CRUD
describe('AnimalReport API', () => {
    beforeEach(async () => {
        await memoryAnimal.deleteMany()
        await memoryUser.deleteMany()
        await memoryAnimalReport.deleteMany()
    })

    describe('GET /api/animal-report', () => {
        it('should return a list of animal reports', async () => {
            const mockUser = await memoryUser.create({ username: 'user1' })
            const mockAnimal = await memoryAnimal.create({
                name: 'Bella',
                species: 'Dog',
            })
            const mockReport = await memoryAnimalReport.create({
                animal: mockAnimal.id,
                location: {
                    address: '123 Main St',
                    coordinates: {
                        type: 'Point',
                        coordinates: [-74.006, 40.7128],
                    },
                },
                reportType: 'Lost',
                description: 'Lost dog in park',
                reportedBy: mockUser.id,
            })

            const response = await request(app).get('/api/animal-report')
            expect(response.status).toBe(200)
            expect(response.body.reports.length).toBe(1)
            expect(response.body.reports[0].reportType).toBe('Lost')
        })
    })

    describe('GET /api/animal-report/:id', () => {
        it('should return a single animal report by ID', async () => {
            const mockUser = await memoryUser.create({ username: 'user2' })
            const mockAnimal = await memoryAnimal.create({
                name: 'Charlie',
                species: 'Cat',
            })
            const mockReport = await memoryAnimalReport.create({
                animal: mockAnimal.id,
                location: {
                    address: '123 Main St',
                    coordinates: {
                        type: 'Point',
                        coordinates: [-74.006, 40.7128],
                    },
                },
                reportType: 'Stray',
                description: 'Found stray cat',
                reportedBy: mockUser.id,
            })

            const response = await request(app).get(
                `/api/animal-report/${mockReport.id}`
            )
            expect(response.status).toBe(200)
            expect(response.body.report).toEqual(mockReport)
        })
    })

    describe('POST /api/animal-report', () => {
        it('should create a new animal report', async () => {
            const mockUser = await memoryUser.create({ username: 'user3' })
            const mockAnimal = await memoryAnimal.create({
                name: 'Max',
                species: 'Bird',
            })

            const reportData = {
                animal: mockAnimal.id,
                location: {
                    address: '456 Elm St',
                    coordinates: {
                        type: 'Point',
                        coordinates: [-74.006, 40.7128],
                    },
                },
                reportType: 'Lost',
                description: 'Lost parrot',
                reportedBy: mockUser.id,
            }

            const response = await request(app)
                .post('/api/animal-report')
                .send(reportData)
            expect(response.status).toBe(201)
            expect(response.body.reportType).toBe('Lost')
            expect(response.body.animal).toBe(mockAnimal.id)
        })
    })

    describe('PUT /api/animal-report/:id', () => {
        it('should update an animal report by ID', async () => {
            const mockUser = await memoryUser.create({ username: 'user4' })
            const mockAnimal = await memoryAnimal.create({
                name: 'Luna',
                species: 'Dog',
            })
            const mockReport = await memoryAnimalReport.create({
                animal: mockAnimal.id,
                location: {
                    address: '789 Oak St',
                    coordinates: {
                        type: 'Point',
                        coordinates: [-74.006, 40.7128],
                    },
                },
                reportType: 'Stray',
                description: 'Found dog near park',
                reportedBy: mockUser.id,
            })

            const updatedData = {
                reportType: 'Lost',
                description: 'Updated description',
            }
            const response = await request(app)
                .put(`/api/animal-report/${mockReport.id}`)
                .send(updatedData)

            expect(response.status).toBe(200)
            expect(response.body.report.reportType).toBe('Lost')
            expect(response.body.report.description).toBe('Updated description')
        })
    })

    describe('DELETE /api/animal-report/:id', () => {
        it('should delete an animal report by ID', async () => {
            const mockUser = await memoryUser.create({ username: 'user5' })
            const mockAnimal = await memoryAnimal.create({
                name: 'Nala',
                species: 'Dog',
            })
            const mockReport = await memoryAnimalReport.create({
                animal: mockAnimal.id,
                location: {
                    address: '1234 Maple St',
                    coordinates: {
                        type: 'Point',
                        coordinates: [-74.006, 40.7128],
                    },
                },
                reportType: 'Stray',
                description: 'Found a dog wandering',
                reportedBy: mockUser.id,
            })

            const response = await request(app).delete(
                `/api/animal-report/${mockReport.id}`
            )
            expect(response.status).toBe(200)
            expect(response.body.message).toBe(
                'Animal report deleted successfully'
            )
            expect(response.body.report).toEqual(mockReport)
        })
    })
})
