const request = require('supertest');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Comment = require('../models/comment'); // Import the Comment model
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

// Comment routes
app.use('/api/comment', async (req, res) => {
    if (req.method === 'GET') {
        try {
            const comments = await Comment.find();
            res.json({ comments });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        try {
            const newComment = new Comment(req.body);
            const createdComment = await newComment.save();
            res.status(201).json(createdComment);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
});

// Jest tests
describe('Comment API', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await Comment.deleteMany();
        await User.deleteMany();
        await AnimalReport.deleteMany();
    });

    it('should create a comment with valid fields', async () => {
      // Create a valid user
      const userData = {
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'Password@123',
      };
  
      const user = new User(userData);
      await user.save();
  
      // Create a valid AnimalReport with corrected field types
      const animalReport = new AnimalReport({
          collar: true,                // collar should be a boolean 
          fixed: 'Yes',                // Use 'Yes' if 'fixed' is an enum value
          reportedBy: user._id,        // reportedBy should reference a user ObjectId
          reportType: 'Lost',          // reportType as string
          location: {
              coordinates: {
                  type: 'Point',
                  coordinates: [40.7128, -74.0060],  // Coordinates as an array of [longitude, latitude]
              },
          },
          animal: new mongoose.Types.ObjectId(),  // Use ObjectId for animal, assuming it's a reference
      });
      await animalReport.save();
  
      // Create a valid comment
      const commentData = {
          content: 'This is a test comment',
          reportId: animalReport._id,   // Use the animalReport's _id for reportId
          userId: user._id,             // Use the user's _id for userId
      };
  
      const response = await request(app).post('/api/comment').send(commentData);
  
      expect(response.status).toBe(201);
      expect(response.body._id).toBeDefined();
      expect(response.body.content).toBe(commentData.content);
      expect(response.body.reportId.toString()).toBe(commentData.reportId.toString());
      expect(response.body.userId.toString()).toBe(commentData.userId.toString());
  });

    it('should return an empty array if no comments exist', async () => {
        const response = await request(app).get('/api/comment');

        expect(response.status).toBe(200);
        expect(response.body.comments).toEqual([]);
    });

    it('should handle missing required fields', async () => {
        const commentData = {
            content: 'Missing reportId and userId',
        };

        const response = await request(app).post('/api/comment').send(commentData);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined(); // Expecting a validation error due to missing fields
    });

    it('should return an error if reportId is invalid', async () => {
      const userData = {
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'Password@123',
      };
  
      const user = new User(userData);
      await user.save();
  
      const commentData = {
          content: 'This is a test comment',
          reportId: 'invalid-report-id',  // Invalid ObjectId
          userId: user._id,
      };
  
      const response = await request(app).post('/api/comment').send(commentData);
  
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/Cast to ObjectId failed/);  // Match the error message
  });

    it('should handle errors during comment creation', async () => {
        const commentData = {
            content: '',
            reportId: new mongoose.Types.ObjectId(),
            userId: new mongoose.Types.ObjectId(),
        };

        const response = await request(app).post('/api/comment').send(commentData);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined(); // Expecting a validation error due to empty content
    });
});
