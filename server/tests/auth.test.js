const request = require('supertest'); // For HTTP request testing
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../controllers/auth'); // Import the auth routes
const { login } = require('../controllers/auth'); // Import the login function
const User = require('../models/user'); // Mock User model
const Message = require('../models/message'); // Mock Message model
const cookieParser = require('cookie-parser');
const authenticate = require('../middleware/auth'); 
require('dotenv').config(); // Load environment variables

// Mock implementations
jest.mock('../models/user');
jest.mock('../models/message');
jest.mock('../controllers/email', () => ({
    sendEmail: jest.fn(), // Mock email sending function
    
}));

// In-memory mock data
const users = [];
const messages = [];

// Mock User methods
User.findOne = jest.fn((query) => {
    return Promise.resolve(users.find((user) =>
        user.username === query.username || user.email === query.email
    ));
});

User.prototype.save = jest.fn(function () {
    users.push(this);
    return Promise.resolve(this);
});

User.prototype.comparePassword = jest.fn(function (password) {
    return bcrypt.compare(password, this.password);
});

// Mock Message methods
Message.prototype.save = jest.fn(function () {
    messages.push(this);
    return Promise.resolve(this);
});

// Express app setup
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser()); // To parse cookies for authentication

// Add routes
app.post('/register', auth.register); // Register route
app.post('/login', auth.login); // Login route
app.post('/logout', auth.logout); // Logout route

// Test suites
describe('Auth API', () => {
    beforeEach(() => {
        users.length = 0; // Clear users array
        messages.length = 0; // Clear messages array
        jest.clearAllMocks(); // Reset mock implementations
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error

    });

    // Register endpoint tests
    test('should register a new user and send a welcome email', async () => {
        const newUser = {
            username: 'testuser',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10),
        };

        const response = await request(app).post('/register').send(newUser);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User successfully registered!');
        expect(users.length).toBe(1);
        expect(messages.length).toBe(1);
    });
    test('should return 400 with validation errors when user input is invalid', async () => {
        // Mock a validation error
        const validationError = new Error('ValidationError');
        validationError.name = 'ValidationError';
        validationError.errors = {
            username: { message: 'Username is required' },
            email: { message: 'Email is not valid' },
        };

        User.prototype.save.mockRejectedValue(validationError);

        const res = await request(app).post('/register').send({
            username: '', // Invalid username
            email: 'invalid-email', // Invalid email
            password: 'password123',
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Username is required, Email is not valid');
    });
    test('should return 500 on server error during registration', async () => {
        // Mock a general error
        User.prototype.save.mockRejectedValue(new Error('Unexpected server error'));

        const res = await request(app).post('/register').send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        });

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Server error during registration');
    });
    test('should not allow duplicate username or email', async () => {
        const existingUser = {
            username: 'testuser',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10),
        };

        User.findOne.mockResolvedValue(existingUser);

        const response = await request(app).post('/register').send(existingUser);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Username or email already exists');
    });

    // Login endpoint tests
    test('should log in an existing user and return a token', async () => {
        const validUser = {
            username: 'testuser',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10),
        };

        User.findOne.mockResolvedValue(validUser); // Mocking successful user lookup
        User.prototype.comparePassword.mockResolvedValue(true); // Mocking successful password comparison

        const response = await request(app)
            .post('/login')
            .send({ username: 'testuser', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Welcome testuser');
    });

    test('should return 404 if user is not found', async () => {
        User.findOne.mockResolvedValueOnce(null); // Mock no user found

        const response = await request(app)
            .post('/login')
            .send({ username: 'nonexistentuser', password: 'password123' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });
    test('should call next middleware with error when an unexpected login error occurs', async () => {
        // Mock User.findOne to throw an error
        const mockError = new Error('Database error');
        User.findOne.mockRejectedValue(mockError);

        const nextMock = jest.fn();

        await login(
            { body: { username: 'testuser', password: 'password123' } },
            { cookie: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() },
            nextMock
        );

        expect(nextMock).toHaveBeenCalledWith(mockError);
        expect(console.error).toHaveBeenCalledWith('Login error:', mockError); // Validate error logging
    });
    test('should return error for incorrect credentials', async () => {
        const validUser = {
            username: 'testuser',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10),
        };

        User.findOne.mockResolvedValue(validUser);
        User.prototype.comparePassword.mockResolvedValue(false); // Mock password mismatch

        const response = await request(app)
            .post('/login')
            .send({ username: 'testuser', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Incorrect username or password');
    });

    // Logout endpoint tests
    test('should clear the authentication token cookie', async () => {
        const response = await request(app).post('/logout');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logout successful');
        expect(response.headers['set-cookie']).toBeDefined(); // Cookie should be cleared
    });

    // Authentication middleware tests
    describe('Authenticate Middleware', () => {
        const SECRET_KEY = 'test-secret-key';
        let server;

        beforeAll(() => {
            process.env.SECRET_KEY = SECRET_KEY;

            const app = express();
            app.use(cookieParser());
            app.use(authenticate);

            app.get('/protected-route', (req, res) => {
                res.status(200).json({ authenticated: true, user: req.user });
            });

            server = app.listen(3001);
        });

        afterAll(() => {
            server.close();
        });

        test('should return 401 if the token is expired', async () => {
            const expiredToken = jwt.sign(
                { userId: 'testUserId' },
                SECRET_KEY,
                { expiresIn: -1 } // Immediately expired token
            );

            const res = await request(server)
                .get('/protected-route')
                .set('Cookie', `token=${expiredToken}`);

            expect(res.status).toBe(401);
            expect(res.body.authenticated).toBe(false);
            expect(res.body.message).toBe('Token expired');
        });

        test('should return 401 if no token is provided', async () => {
            const res = await request(server).get('/protected-route');

            expect(res.status).toBe(401);
            expect(res.body.authenticated).toBe(false);
            expect(res.body.message).toBe('Authentication required');
        });

        test('should return 401 if the token is invalid', async () => {
            const invalidToken = 'invalidTokenValue';

            const res = await request(server)
                .get('/protected-route')
                .set('Cookie', `token=${invalidToken}`);

            expect(res.status).toBe(401);
            expect(res.body.authenticated).toBe(false);
            expect(res.body.message).toBe('Invalid token');
        });
        test('should return 404 if user is not found in the database', async () => {
            // Generate a valid token
            const token = jwt.sign(
                { userId: 'nonexistentUserId' },
                SECRET_KEY,
                { expiresIn: '1h' }
            );
    
            // Mock User.findById to return null (user not found)
            User.findById.mockResolvedValue(null);
    
            const res = await request(server)
                .get('/protected-route')
                .set('Cookie', `token=${token}`);
    
            expect(res.status).toBe(404);
            expect(res.body.authenticated).toBe(false);
            expect(res.body.message).toBe('User not found');
        });
        test('should authenticate and attach the user to the request if user exists', async () => {
            // Mock a user object
            const mockUser = { _id: 'validUserId', username: 'testuser' };
    
            // Generate a valid token
            const token = jwt.sign(
                { userId: mockUser._id },
                SECRET_KEY,
                { expiresIn: '1h' }
            );
    
            // Mock User.findById to return the mock user
            User.findById.mockResolvedValue(mockUser);
    
            const res = await request(server)
                .get('/protected-route')
                .set('Cookie', `token=${token}`);
    
            expect(res.status).toBe(200);
            expect(res.body.authenticated).toBe(true);
            expect(res.body.user).toEqual(mockUser);
        });
    });
    
});