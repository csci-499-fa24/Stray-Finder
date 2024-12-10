const request = require('supertest');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Notification = require('../models/notification'); // Import the Notification model
const AnimalReport = require('../models/animalReport'); // Import the AnimalReport model
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
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/test';
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Disconnect after tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Test routes for Notification 
app.use('/api/notification', async (req, res) => {
  if (req.method === 'GET') {
    try {
      const notifications = await Notification.find();
      res.json({ notifications });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const newNotification = new Notification(req.body);
      const createdNotification = await newNotification.save();
      res.status(201).json(createdNotification);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
});

// Jest tests
describe('Notification API', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await Notification.deleteMany();
    await AnimalReport.deleteMany();
    await User.deleteMany(); // Clear User if needed
  });

  it('should create a notification with valid fields', async () => {
    const notificationData = {
      userId: new mongoose.Types.ObjectId(),
      message: 'This is a test notification',
      type: 'comment',
    };

    const response = await request(app).post('/api/notification').send(notificationData);

    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
    expect(response.body.message).toBe(notificationData.message);
    expect(response.body.type).toBe(notificationData.type);
    expect(response.body.read).toBe(false); // Default value
  });

  it('should return a list of notifications', async () => {
    const mockNotification = {
      userId: new mongoose.Types.ObjectId(),
      message: 'Notification 1',
      type: 'alert',
    };

    const newNotification = new Notification(mockNotification);
    await newNotification.save();

    const response = await request(app).get('/api/notification');

    expect(response.status).toBe(200);
    expect(response.body.notifications.length).toBe(1);
    expect(response.body.notifications[0].message).toBe(mockNotification.message);
  });

  it('should return an empty array if no notifications exist', async () => {
    const response = await request(app).get('/api/notification');

    expect(response.status).toBe(200);
    expect(response.body.notifications).toEqual([]);
  });

  it('should validate required fields', async () => {
    const invalidNotificationData = {
      message: 'Missing required userId and type',
    };

    const response = await request(app).post('/api/notification').send(invalidNotificationData);

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/validation failed/i);
  });

  it('should populate referenced fields correctly', async () => {
    // Create a mock user
    const user = new User({
    username: `testuser_${Date.now()}`,  // Use a timestamp to ensure uniqueness
    email: 'testuser@example.com',
    password: 'Password1!',
    });
    await user.save();

    // Create a mock AnimalReport
    const report = new AnimalReport({
      collar: true,
      fixed: 'Yes',
      reportedBy: user._id, // reference user._id here
      reportType: 'Lost',
      location: {
        coordinates: {
          type: 'Point',
          coordinates: [40.7128, -74.0060],  // Coordinates as an array of [longitude, latitude]
        },
      },
      animal: new mongoose.Types.ObjectId(),
      name: 'Lost Dog',  
      description: 'A brown dog with a red collar.',
    });

    await report.save();

    const notificationData = {
      userId: new mongoose.Types.ObjectId(),
      message: 'Notification with reference',
      type: 'report',
      meta: {
        reportId: report._id,
      },
    };

    const notification = new Notification(notificationData);
    const savedNotification = await notification.save();

    const populatedNotification = await Notification.findById(savedNotification._id)
      .populate('meta.reportId'); // Populate the 'reportId' field in 'meta'

    expect(populatedNotification.meta.reportId).toBeDefined();
    expect(populatedNotification.meta.reportId.description).toBe(report.description);
  });
});
