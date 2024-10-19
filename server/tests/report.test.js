const request = require('supertest');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// In-memory Report Model
class InMemoryReportModel {
    constructor() {
        this.reports = [];
    }

    async create(report) {
        this.reports.push(report);
        return report;
    }

    async findById(id) {
        return this.reports.find((report) => report.id === id);
    }

    async find() {
        return this.reports;
    }

    async update(id, newData) {
        const reportIndex = this.reports.findIndex((report) => report.id === id);
        if (reportIndex !== -1) {
            this.reports[reportIndex] = { ...this.reports[reportIndex], ...newData };
            return this.reports[reportIndex];
        }
        return null;
    }

    async delete(id) {
        const reportIndex = this.reports.findIndex((report) => report.id === id);
        if (reportIndex !== -1) {
            return this.reports.splice(reportIndex, 1)[0];
        }
        return null;
    }
}

// Create an instance of the in-memory model
const memoryReport = new InMemoryReportModel();

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

// Report routes
app.use('/api/report', (req, res) => {
    if (req.method === 'GET') {
        memoryReport.find().then((reports) => {
            res.json({ reports });
        });
    } else if (req.method === 'POST') {
        const newReport = req.body;
        memoryReport.create(newReport).then((createdReport) => {
            res.status(201).json(createdReport);
        });
    } else if (req.method === 'PUT') {
        const { id } = req.body;
        const newData = req.body;
        memoryReport.update(id, newData).then((updatedReport) => {
            res.status(200).json(updatedReport);
        });
    } else if (req.method === 'DELETE') {
        const { id } = req.body;
        memoryReport.delete(id).then((deletedReport) => {
            res.status(200).json(deletedReport);
        });
    }
});

// Jest tests
describe('Report API', () => {
    beforeEach(async () => {
        // Clear the in-memory database before each test
        memoryReport.reports = [];
    });

    it('should create a report', async () => {
        const newReport = {
            id: '123',
            title: 'Lost Dog',
            description: 'Small black dog missing.',
            userId: 'user123',
        };

        const response = await request(app).post('/api/report').send(newReport);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(newReport);
    });

    it('should update a report', async () => {
        const report = {
            id: '123',
            title: 'Lost Dog',
            description: 'Small black dog missing.',
            userId: 'user123',
        };

        await memoryReport.create(report);

        const updatedData = { title: 'Found Dog', description: 'Dog has been found' };
        const response = await request(app).put('/api/report').send({ id: '123', ...updatedData });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Found Dog');
        expect(response.body.description).toBe('Dog has been found');
    });

    it('should delete a report', async () => {
        const report = {
            id: '123',
            title: 'Lost Dog',
            description: 'Small black dog missing.',
            userId: 'user123',
        };

        await memoryReport.create(report);

        const response = await request(app).delete('/api/report').send({ id: '123' });

        expect(response.status).toBe(200);
        expect(response.body.id).toBe('123');
    });
});
