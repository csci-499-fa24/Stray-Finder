const request = require('supertest');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { sendEmail, sendReportsEmail, fetchAllRecentAnimals } = require('../controllers/email');
const Animal = require('../models/animal');
const AnimalReport = require('../models/animalReport');
const User = require('../models/user');

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

describe('Email Controller', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await Animal.deleteMany();
    await AnimalReport.deleteMany();
    await User.deleteMany();
  });

  describe('fetchAllRecentAnimals', () => {
    it('should fetch recent animal reports within the last week', async () => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Create test data
      const animal = await Animal.create({ name: 'Buddy', species: 'Dog', gender: 'Male' });
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password1!', // Added password field
      });

      await AnimalReport.create({
        animal: animal._id,
        reportedBy: user._id,
        reportType: 'Found',
        dateReported: new Date(),
        collar: false, // Added required field
        fixed: 'No', // Added required field
        location: {
            coordinates: {
                type: 'Point',
                coordinates: [40.7128, -74.0060],  // Coordinates as an array of [longitude, latitude]
              },
            },
        name: 'Lost pup',
        description: 'A brown dog with a blue collar.',
      });

      // Mock request and call the function
      const req = { query: {} };
      const reports = await fetchAllRecentAnimals(req);

      expect(reports.length).toBe(1);
      expect(reports[0].animal.name).toBe('Buddy');
    });
    it('should filter reports by userId if provided', async () => {
        // Create test data
        const user1 = await User.create({
          username: 'user1',
          email: 'user1@example.com',
          password: 'Password1!',
        });
      
        const user2 = await User.create({
          username: 'user2',
          email: 'user2@example.com',
          password: 'Password2!',
        });
      
        const animal = await Animal.create({ name: 'Buddy', species: 'Dog', gender: 'Male' });
      
        // Create reports associated with different users
        await AnimalReport.create({
          animal: animal._id,
          reportedBy: user1._id,
          reportType: 'Lost',
          dateReported: new Date(),
          collar: true,
          fixed: 'Yes',
          location: {
            coordinates: {
              type: 'Point',
              coordinates: [-74.0060, 40.7128], // Correct: [longitude, latitude]
            },
          },
          name: 'Buddy',
          description: 'Lost brown dog with a collar.',
        });
      
        await AnimalReport.create({
          animal: animal._id,
          reportedBy: user2._id,
          reportType: 'Found',
          dateReported: new Date(),
          collar: true,
          fixed: 'No',
          location: {
            coordinates: {
              type: 'Point',
              coordinates: [-118.2437, 34.0522], // Correct: [longitude, latitude]
            },
          },
          name: 'Lost Buddy',
          description: 'Found a dog matching the description of Buddy.',
        });
      
        // Mock request with userId filter
        const req = { query: { userId: user1._id.toString() } };
        const reports = await fetchAllRecentAnimals(req);
      
        // Verify that only the report from user1 is returned
        expect(reports.length).toBe(1);
        expect(reports[0].reportedBy._id.toString()).toBe(user1._id.toString());
      });
      it('should filter reports by animal gender and species if provided', async () => {
        // Create test data: animals with different genders and species
        const dogMale = await Animal.create({ name: 'Rex', species: 'Dog', gender: 'Male' });
        const dogFemale = await Animal.create({ name: 'Bella', species: 'Dog', gender: 'Female' });
        const catMale = await Animal.create({ name: 'Whiskers', species: 'Cat', gender: 'Male' });
      
        const user = await User.create({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password1!',
        });
      
        // Create reports for each animal
        await AnimalReport.create({
          animal: dogMale._id,
          reportedBy: user._id,
          reportType: 'Found',
          dateReported: new Date(),
          collar: true,
          fixed: 'Yes',
          location: {
            coordinates: {
              type: 'Point',
              coordinates: [-74.0060, 40.7128],
            },
          },
          name: 'Found Dog',
          description: 'A male dog with a red collar.',
        });
      
        await AnimalReport.create({
          animal: dogFemale._id,
          reportedBy: user._id,
          reportType: 'Lost',
          dateReported: new Date(),
          collar: false,
          fixed: 'No',
          location: {
            coordinates: {
              type: 'Point',
              coordinates: [-118.2437, 34.0522],
            },
          },
          name: 'Lost Bella',
          description: 'A female dog, very friendly.',
        });
      
        await AnimalReport.create({
          animal: catMale._id,
          reportedBy: user._id,
          reportType: 'Found',
          dateReported: new Date(),
          collar: false,
          fixed: 'No',
          location: {
            coordinates: {
              type: 'Point',
              coordinates: [-122.4194, 37.7749],
            },
          },
          name: 'Lost Cat',
          description: 'A male cat with white fur.',
        });
      
        // Mock request with gender and species filters
        const req = { query: { gender: 'Male', species: 'Dog' } };
        const reports = await fetchAllRecentAnimals(req);
      
        // Verify that only the report for the male dog is returned
        expect(reports.length).toBe(1);
        expect(reports[0].animal.name).toBe('Rex');
        expect(reports[0].animal.gender).toBe('Male');
        expect(reports[0].animal.species).toBe('Dog');
      });
    it('should return an empty array if no recent reports exist', async () => {
      const req = { query: {} };
      const reports = await fetchAllRecentAnimals(req);

      expect(reports).toEqual([]);
    });
  });

  describe('sendEmail', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
      });
    
      afterEach(() => {
        jest.restoreAllMocks(); // Restore console.error after tests
      });
    it('should send an email successfully', async () => {
      const mockSendMail = jest.fn().mockResolvedValue('Email sent');
      nodemailer.createTransport = jest.fn().mockReturnValue({ sendMail: mockSendMail });

      await sendEmail({
        targetEmail: 'recipient@example.com',
        subject: 'Test Email',
        body: '<p>This is a test email</p>',
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'recipient@example.com',
          subject: 'Test Email',
        })
      );
    });

  it('should throw an error if sending email fails', async () => {
    const mockSendMail = jest.fn().mockRejectedValue(new Error('Failed to send email'));
    nodemailer.createTransport = jest.fn().mockReturnValue({ sendMail: mockSendMail });

    await expect(sendEmail({ to: 'test@example.com', subject: 'Test', text: 'Test' })).rejects.toThrow(
      'Failed to send email'
    );
    });
  });

  describe('sendReportsEmail', () => {
    it('should send emails to users with reports', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password1!', // Added password field
        notificationPreference: 'daily',
      });

      const animal = await Animal.create({ name: 'Buddy', species: 'Dog', gender: 'Male' });
      await AnimalReport.create({
        animal: animal._id,
        reportedBy: user._id,
        reportType: 'Found',
        dateReported: new Date(),
        collar: true, // Added required field
        fixed: 'No', // Added required field
        location: {
            coordinates: {
                type: 'Point',
                coordinates: [40.7128, -74.0060],  // Coordinates as an array of [longitude, latitude]
            },
        },
        name: 'Lost Dog',  
        description: 'A brown dog with a red collar.',
      });

      const mockSendMail = jest.fn().mockResolvedValue('Email sent');
      nodemailer.createTransport = jest.fn().mockReturnValue({ sendMail: mockSendMail });

      const req = { query: {} };
      const result = await sendReportsEmail(req);

      expect(result).toBe('Animal reports sent successfully.');
      expect(mockSendMail).toHaveBeenCalled();
    });

    it('should return a message if no users to send reports to', async () => {
      const req = { query: {} };
      const result = await sendReportsEmail(req);

      expect(result).toBe('No users to send reports to.');
    });

    it('should return a message if no reports exist', async () => {
        await User.create({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password1!', // Added password field
        });
  
        const req = { query: {} };
        const result = await sendReportsEmail(req);
  
        expect(result).toBe('No reports to send.');
      });
  });
});
