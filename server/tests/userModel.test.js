const request = require('supertest');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Import the User model
require('dotenv').config();

// Express app setup
const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    cors({
        origin: process.env.NEXT_PUBLIC_CLIENT_URL,
    })
);

// Connect to a test database
beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/test';
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

// Disconnect after tests
afterAll(async () => {
    await mongoose.connection.close();
});

// User routes
app.use('/api/user', async (req, res) => {
    if (req.method === 'GET') {
        try {
            const users = await User.find();
            res.json({ users });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        try {
            const newUser = new User(req.body);
            const createdUser = await newUser.save();
            res.status(201).json(createdUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
});

// Jest tests
describe('User API', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await User.deleteMany();
    });

    it('should create a user with valid fields', async () => {
        const userData = {
            username: 'testuser',
            email: 'testuser@example.com1',
            password: 'Password@123',
        };

        const response = await request(app).post('/api/user').send(userData);

        expect(response.status).toBe(201);
        expect(response.body._id).toBeDefined();
        expect(response.body.username).toBe(userData.username);
        expect(response.body.email).toBe(userData.email);
        expect(response.body.password).not.toBe(userData.password); // Password should be hashed
    });

    it('should return a list of users', async () => {
        const mockUser = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'Password@123',
        };

        const newUser = new User(mockUser);
        await newUser.save();

        const response = await request(app).get('/api/user');

        expect(response.status).toBe(200);
        expect(response.body.users.length).toBe(1);
        expect(response.body.users[0].username).toBe(mockUser.username);
    });

    it('should return an empty array if no users exist', async () => {
        const response = await request(app).get('/api/user');

        expect(response.status).toBe(200);
        expect(response.body.users).toEqual([]);
    });
    it('should handle errors during password hashing', async () => {
        jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => {
            throw new Error('Hashing error');
        });

        const userData = {
            username: 'erroruser',
            email: 'erroruser@example.com',
            password: 'Password@123',
        };

        const response = await request(app).post('/api/user').send(userData);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Hashing error');

        bcrypt.genSalt.mockRestore();
    });
    it('should skip hashing if the password is not modified', async () => {
        const userData = {
            username: 'modcheckuser',
            email: 'modcheckuser@example.com',
            password: 'Password@123',
        };

        const newUser = new User(userData);
        await newUser.save();

        jest.spyOn(newUser, 'isModified').mockReturnValue(false);

        const savedUser = await newUser.save();
        expect(savedUser.password).toBe(newUser.password); // Password remains unchanged

        newUser.isModified.mockRestore();
    });
    it('should compare passwords correctly', async () => {
        const userData = {
            username: 'compareuser',
            email: 'compareuser@example.com',
            password: 'Password@123',
        };

        const newUser = new User(userData);
        await newUser.save();

        const savedUser = await User.findOne({ email: userData.email });
        const isMatch = await savedUser.comparePassword(userData.password);

        expect(isMatch).toBe(true);

        const isWrongMatch = await savedUser.comparePassword('WrongPassword');
        expect(isWrongMatch).toBe(false);
    });
});

