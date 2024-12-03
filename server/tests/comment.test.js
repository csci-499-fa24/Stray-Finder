const request = require('supertest')
const express = require('express')
const cors = require('cors')

const { saveComment, getComments, getCommentCount } = require('../controllers/comment')

require('dotenv').config()

// In-memory models
class InMemoryCommentModel {
    constructor() {
        this.comments = []
    }

    async create(comment) {
        this.comments.push(comment)
        return comment
    }

    async find(query) {
        return this.comments.filter(comment => comment.reportId.toString() === query.reportId.toString())
    }

    async countDocuments(query) {
        return this.comments.filter(comment => comment.reportId.toString() === query.reportId.toString()).length
    }

    async deleteMany() {
        this.comments = []
    }
}

class InMemoryAnimalReportModel {
    constructor() {
        this.reports = []
    }

    async findById(id) {
        return this.reports.find(report => report._id.toString() === id.toString())
    }

    async create(report) {
        this.reports.push(report)
        return report
    }

    async deleteMany() {
        this.reports = []
    }
}

class InMemoryNotificationModel {
    constructor() {
        this.notifications = []
    }

    async create(notification) {
        this.notifications.push(notification)
        return notification
    }

    async findOne(query) {
        return this.notifications.find(notification => notification.userId.toString() === query.userId.toString() && notification.meta.reportId.toString() === query.meta.reportId.toString())
    }

    async deleteMany() {
        this.notifications = []
    }
}

// Create in-memory model instances
const memoryComment = new InMemoryCommentModel()
const memoryAnimalReport = new InMemoryAnimalReportModel()
const memoryNotification = new InMemoryNotificationModel()
const newComment = {
    content: 'This is a comment.',
    userId: 'mockUserId', // Add a mock user ID
    reportId: 'mockReportId', // Add a mock report ID
  };
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

// Comment routes
app.post('/api/comment/:reportId', saveComment)
app.get('/api/comment/:reportId', getComments)
app.get('/api/comment-count/:reportId', getCommentCount)

// Jest tests
describe('POST /api/comment/:reportId', () => {
    beforeEach(async () => {
        await memoryComment.deleteMany();
        await memoryAnimalReport.deleteMany();
        await memoryNotification.deleteMany();
    });

/*    it('should save a comment and send a notification if the report exists', async () => {
        const mockReport = {
            _id: 'reportId123',
            animal: 'animalId123', // Mock Animal ID
            location: {
                address: '123 Pet Street',
                coordinates: {
                    type: 'Point',
                    coordinates: [-73.935242, 40.73061], // Example [lng, lat]
                },
            },
            dateReported: new Date(),
            reportType: 'Lost',
            description: 'Lost dog near park',
            reportedBy: 'userId123',
            fixed: 'Yes',
            collar: true,
        };

        const mockUser = {
            _id: 'userId456',
            username: 'johnDoe',
            profileImage: 'https://example.com/johndoe.jpg',
        };

        // Add mock report to in-memory database
        await memoryAnimalReport.create(mockReport);

        // Set up the request with mock user data
        const response = await request(app)
            .post('/api/comment/reportId123')
            .send({ content: 'This is a comment.' })
            .set('user', JSON.stringify(mockUser)); // Pass user data as stringified JSON

        expect(response.status).toBe(201);
        expect(response.body.content).toBe('This is a comment.');
        expect(memoryNotification.notifications.length).toBe(1);
        expect(memoryNotification.notifications[0].message).toBe('New comment on your post: Lost dog near park');
    });
*/
    it('should return an error if content is missing', async () => {
        const response = await request(app).post('/api/comment/reportId123').send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Comment content is required');
    });
});
/*
describe('GET /api/comment/:reportId', () => {
    beforeEach(async () => {
        await memoryComment.deleteMany();
        await memoryAnimalReport.deleteMany();
    });

    it('should fetch all comments for a specific report', async () => {
        const mockReport = {
            _id: 'reportId123',
            animal: 'animalId123',
            location: {
                address: '123 Pet Street',
                coordinates: {
                    type: 'Point',
                    coordinates: [-73.935242, 40.73061],
                },
            },
            dateReported: new Date(),
            reportType: 'Lost',
            description: 'Lost dog near park',
            reportedBy: 'userId123',
            fixed: 'Yes',
            collar: true,
        };
        const mockComment = {
            content: 'This is a comment.',
            reportId: 'reportId123',
            userId: 'userId456',
        };

        await memoryAnimalReport.create(mockReport);
        await memoryComment.create(mockComment);

        const response = await request(app).get('/api/comment/reportId123');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].content).toBe('This is a comment.');
    });
});

describe('GET /api/comment-count/:reportId', () => {
    beforeEach(async () => {
        await memoryComment.deleteMany();
        await memoryAnimalReport.deleteMany();
    });

    it('should return the count of comments for a specific report', async () => {
        const mockReport = {
            _id: 'reportId123',
            animal: 'animalId123',
            location: {
                address: '123 Pet Street',
                coordinates: {
                    type: 'Point',
                    coordinates: [-73.935242, 40.73061],
                },
            },
            dateReported: new Date(),
            reportType: 'Lost',
            description: 'Lost dog near park',
            reportedBy: 'userId123',
            fixed: 'Yes',
            collar: true,
        };

        await memoryAnimalReport.create(mockReport);

        await memoryComment.create({
            content: 'First comment.',
            reportId: 'reportId123',
            userId: 'userId456',
        });

        await memoryComment.create({
            content: 'Second comment.',
            reportId: 'reportId123',
            userId: 'userId789',
        });

        const response = await request(app).get('/api/comment-count/reportId123');

        expect(response.status).toBe(200);
        expect(response.body.count).toBe(2);
    }); 
});
*/