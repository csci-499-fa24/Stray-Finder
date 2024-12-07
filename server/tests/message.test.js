const request = require('supertest');
const express = require('express');
const { sendEmail } = require('../controllers/email'); // Mocked email function
require('dotenv').config(); // Load environment variables

// In-memory models for Message and User
class InMemoryMessageModel {
    constructor() {
        this.messages = [];
    }
    async create(message) {
        this.messages.push(message);
        return message;
    }
    async find(query) {
        return this.messages.filter((message) =>
            Object.keys(query).every((key) => message[key] === query[key])
        );
    }
    async updateMany(filter, update) {
        this.messages.forEach((message) => {
            if (Object.keys(filter).every((key) => message[key] === filter[key])) {
                Object.assign(message, update);
            }
        });
    }
    async deleteMany() {
        this.messages = [];
    }
}

class InMemoryUserModel {
    constructor() {
        this.users = [];
    }
    async findById(userId) {
        return this.users.find((user) => user._id === userId);
    }
    async create(user) {
        this.users.push(user);
        return user;
    }
    async deleteMany() {
        this.users = [];
    }
}

// Mock implementation
jest.mock('../controllers/email', () => ({
    sendEmail: jest.fn(),
}));

// App setup
const app = express();
app.use(express.json());

// Mock middleware
app.use((req, res, next) => {
    req.user = { _id: '12345', username: 'testUser' }; // Mock user
    next();
});

// Routes
app.post('/api/messages/:recipientId', async (req, res) => {
    const { content, animalReportId } = req.body;
    const { recipientId } = req.params;

    if (!recipientId || !content) {
        return res.status(400).json({ message: 'Recipient and content are required' });
    }

    const recipient = await memoryUser.findById(recipientId);
    if (!recipient) {
        return res.status(404).json({ message: 'Recipient not found' });
    }

    const message = await memoryMessage.create({
        senderId: req.user._id,
        recipientId,
        content,
        animalReportId: animalReportId || null,
    });

    if (recipient.notificationPreference === 'immediate') {
        await sendEmail({
            targetEmail: recipient.email,
            subject: `New Message from ${req.user.username}`,
            body: `You have a new message: ${content}`,
        });
    }

    res.status(201).json(message);
});

// In-memory models
const memoryMessage = new InMemoryMessageModel();
const memoryUser = new InMemoryUserModel();

// Test suite
describe('POST /api/messages/:recipientId', () => {
    beforeEach(async () => {
        await memoryMessage.deleteMany();
        await memoryUser.deleteMany();
        await memoryUser.create({
            _id: '67890',
            email: 'recipient@example.com',
            username: 'recipientUser',
            notificationPreference: 'immediate',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should send a message successfully', async () => {
        sendEmail.mockResolvedValue('Email sent successfully');

        const response = await request(app)
            .post('/api/messages/67890')
            .send({
                content: 'Hello, this is a test message!',
                animalReportId: '98765',
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            expect.objectContaining({
                senderId: '12345',
                recipientId: '67890',
                content: 'Hello, this is a test message!',
                animalReportId: '98765',
            })
        );
        expect(sendEmail).toHaveBeenCalledWith({
            targetEmail: 'recipient@example.com',
            subject: 'New Message from testUser',
            body: 'You have a new message: Hello, this is a test message!',
        });
    });

    test('should return 400 if recipient or content is missing', async () => {
        const response = await request(app).post('/api/messages/67890').send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Recipient and content are required' });
    });

    test('should return 404 if recipient is not found', async () => {
        const response = await request(app).post('/api/messages/99999').send({
            content: 'Hello, this is a test message!',
        });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Recipient not found' });
    });
});
