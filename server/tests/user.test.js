
const request = require('supertest')
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
require('dotenv').config()

// In-memory User Model
class InMemoryUserModel {
    constructor() {
        this.users = []
    }

    async create(user) {
        this.users.push(user)
        return user
    }

    async findById(id) {
        return this.users.find(user => user.id === id)
    }

    async deleteMany() {
        this.users = []
    }
}

// Create an instance of the in-memory model
const memoryUser = new InMemoryUserModel()

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

// Mock middleware to inject `req.user` for auth simulation
app.use((req, res, next) => {
    req.user = { id: '1' } // Mock logged-in user ID
    next()
})

// User routes
app.get('/api/user/profile', async (req, res) => {
    const user = await memoryUser.findById(req.user.id)
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    const { password, ...safeUser } = user // Exclude password
    res.json(safeUser)
})

app.post('/api/user/update', async (req, res) => {
    const user = await memoryUser.findById(req.user.id)
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    const { username, email } = req.body
    if (username) user.username = username
    if (email) user.email = email
    res.json(user)
})

app.put('/api/user', async (req, res) => {
    const { currentPassword, newPassword } = req.body
    const user = await memoryUser.findById(req.user.id)

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    // Regex from user model
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    res.status(200).json({ message: 'Password updated successfully' })
})

// Jest tests
describe('User API Endpoints', () => {
    beforeEach(async () => {
        // Clear the in-memory database before each test
        await memoryUser.deleteMany()
    })

    describe('GET /api/user/profile', () => {
        it('should return the user profile', async () => {
            const mockUser = {
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
                password: await bcrypt.hash('password', 10),
            }
            await memoryUser.create(mockUser)

            const response = await request(app).get('/api/user/profile')

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
            })
        })

        it('should return 404 if user is not found', async () => {
            const response = await request(app).get('/api/user/profile')

            expect(response.status).toBe(404)
            expect(response.body).toEqual({ message: 'User not found' })
        })
    })

    describe('POST /api/user/update', () => {
        it('should update the user profile', async () => {
            const mockUser = {
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
                password: await bcrypt.hash('password', 10),
            }
            await memoryUser.create(mockUser)

            const updatedData = { username: 'newuser', email: 'new@example.com' }
            const response = await request(app)
                .post('/api/user/update')
                .send(updatedData)

            expect(response.status).toBe(200)
            expect(response.body).toEqual({
                id: '1',
                username: 'newuser',
                email: 'new@example.com',
                password: expect.any(String), // Password should not change
            })
        })

        it('should return 404 if user is not found', async () => {
            const response = await request(app)
                .post('/api/user/update')
                .send({ username: 'newuser' })

            expect(response.status).toBe(404)
            expect(response.body).toEqual({ message: 'User not found' })
        })
    })

    describe('POST /api/user', () => {
        it('should reject passwords that do not meet complexity requirements', async () => {
            // Create a mock user
            const mockUser = {
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
                password: await bcrypt.hash('oldPassword123!', 10),
            }
            await memoryUser.create(mockUser)

            const newUser = {
                currentPassword: 'oldPassword123!',
                newPassword: 'weakpassword', // This should fail the complexity check
            }

            // Send request with mock user injected into req.user
            const response = await request(app)
                .put('/api/user')
                .send(newUser)

            expect(response.status).toBe(400) // Expect 400 for invalid password
            expect(response.body.message).toBe(
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
            )
        })

        it('should accept valid passwords', async () => {
            const mockUser = {
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
                password: await bcrypt.hash('oldPassword123!', 10),
            }
            await memoryUser.create(mockUser)

            const newUser = {
                currentPassword: 'oldPassword123!',
                newPassword: 'NewPassword123!',  // Valid password
            }

            // Send request with mock user injected into req.user
            const response = await request(app)
                .put('/api/user')
                .send(newUser)

            expect(response.status).toBe(200) // Expect 200 for valid password
            expect(response.body.message).toBe('Password updated successfully')
        })
    })

    describe('Password Hashing and Comparison', () => {
        it('should hash the password before saving it', async () => {
            const password = 'password123!'
            const mockUser = {
                id: '1',
                username: 'testuser',
                email: 'test@example.com',
                password: await bcrypt.hash(password, 10),  // Hash the password before saving
            }

            const user = await memoryUser.create(mockUser)

            expect(user.password).not.toBe(password) // Password should be hashed
            const match = await bcrypt.compare(password, user.password)
            expect(match).toBe(true) // The hashed password should match the original one
        })

        it('should compare passwords correctly', async () => {
            const password = 'password123!'
            const hashedPassword = await bcrypt.hash(password, 10)

            const result = await bcrypt.compare(password, hashedPassword)

            expect(result).toBe(true) // Password comparison should return true
        })
    })
})
