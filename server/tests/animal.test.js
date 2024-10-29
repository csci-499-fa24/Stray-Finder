const request = require('supertest')
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

// In-memory Animal Model for Testing
class InMemoryAnimalModel {
    constructor() {
        this.animals = []
        this.currentId = 1
    }

    async create(animalData) {
        const newAnimal = {
            id: this.currentId++,
            name: animalData.name,
            species: animalData.species,
            breed: animalData.breed || null,
            color: animalData.color || null,
            gender: animalData.gender || 'Unknown',
            fixed: animalData.fixed || 'Unknown',
            collar: animalData.collar || false,
            description: animalData.description || '',
            imageUrl: animalData.imageUrl || '',
        }
        this.animals.push(newAnimal)
        return newAnimal
    }

    async find(query = {}) {
        return this.animals.filter((animal) =>
            Object.keys(query).every((key) => animal[key] === query[key])
        )
    }

    async findById(id) {
        return this.animals.find((animal) => animal.id === id)
    }

    async findByIdAndUpdate(id, updateData) {
        const animal = this.animals.find((animal) => animal.id === id)
        if (animal) {
            Object.assign(animal, updateData)
            return animal
        }
        return null
    }

    async findByIdAndDelete(id) {
        const index = this.animals.findIndex((animal) => animal.id === id)
        if (index !== -1) {
            return this.animals.splice(index, 1)[0]
        }
        return null
    }

    async deleteMany() {
        this.animals = []
    }
}

// Initialize in-memory model and Express app
const memoryAnimal = new InMemoryAnimalModel()
const app = express()

// Middleware setup
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(
    cors({
        origin: process.env.NEXT_PUBLIC_CLIENT_URL,
    })
)

// Route Handlers without Authentication
app.get('/api/animal', async (req, res) => {
    const animals = await memoryAnimal.find(req.query)
    res.status(200).json({ animals })
})

app.get('/api/animal/:id', async (req, res) => {
    const animal = await memoryAnimal.findById(Number(req.params.id))
    if (animal) {
        res.status(200).json({ animal })
    } else {
        res.status(404).json({ message: 'Animal not found' })
    }
})

app.post('/api/animal', async (req, res) => {
    const newAnimal = await memoryAnimal.create(req.body)
    res.status(201).json(newAnimal)
})

app.put('/api/animal/:id', async (req, res) => {
    const updatedAnimal = await memoryAnimal.findByIdAndUpdate(
        Number(req.params.id),
        req.body
    )
    if (updatedAnimal) {
        res.status(200).json({ animal: updatedAnimal })
    } else {
        res.status(404).json({ message: 'Animal not found' })
    }
})

app.delete('/api/animal/:id', async (req, res) => {
    const deletedAnimal = await memoryAnimal.findByIdAndDelete(
        Number(req.params.id)
    )
    if (deletedAnimal) {
        res.status(200).json({
            message: 'Animal deleted successfully',
            animal: deletedAnimal,
        })
    } else {
        res.status(404).json({ message: 'Animal not found' })
    }
})

// Jest Tests
describe('Animal API', () => {
    beforeEach(async () => {
        await memoryAnimal.deleteMany()
    })

    describe('GET /api/animal', () => {
        it('should return a list of animals', async () => {
            const mockAnimal = {
                name: 'Bella',
                species: 'Dog',
                breed: 'Golden Retriever',
            }
            await memoryAnimal.create(mockAnimal)

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
            const mockAnimal = await memoryAnimal.create({
                name: 'Charlie',
                species: 'Cat',
                gender: 'Male',
            })
            const response = await request(app).get(
                `/api/animal/${mockAnimal.id}`
            )
            expect(response.status).toBe(200)
            expect(response.body.animal).toEqual(mockAnimal)
        })

        it('should return 404 if animal is not found', async () => {
            const response = await request(app).get('/api/animal/999')
            expect(response.status).toBe(404)
            expect(response.body.message).toBe('Animal not found')
        })
    })

    describe('PUT /api/animal/:id', () => {
        it('should update an animal by ID', async () => {
            const mockAnimal = await memoryAnimal.create({
                name: 'Luna',
                species: 'Dog',
            })
            const updatedData = { name: 'Luna Updated', breed: 'Husky' }

            const response = await request(app)
                .put(`/api/animal/${mockAnimal.id}`)
                .send(updatedData)
            expect(response.status).toBe(200)
            expect(response.body.animal.name).toBe('Luna Updated')
            expect(response.body.animal.breed).toBe('Husky')
        })

        it('should return 404 if animal is not found for update', async () => {
            const response = await request(app)
                .put('/api/animal/999')
                .send({ name: 'Non-existent' })
            expect(response.status).toBe(404)
            expect(response.body.message).toBe('Animal not found')
        })
    })

    describe('DELETE /api/animal/:id', () => {
        it('should delete an animal by ID', async () => {
            const mockAnimal = await memoryAnimal.create({
                name: 'Max',
                species: 'Bird',
            })
            const response = await request(app).delete(
                `/api/animal/${mockAnimal.id}`
            )
            expect(response.status).toBe(200)
            expect(response.body.message).toBe('Animal deleted successfully')
            expect(response.body.animal).toEqual(mockAnimal)
        })

        it('should return 404 if animal is not found for deletion', async () => {
            const response = await request(app).delete('/api/animal/999')
            expect(response.status).toBe(404)
            expect(response.body.message).toBe('Animal not found')
        })
    })
})
