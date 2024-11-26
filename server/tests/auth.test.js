const request = require('supertest'); // For HTTP request testing
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('./auth'); // Import the auth routes
const User = require('../models/user'); // Mock User model
const Message = require('../models/message'); // Mock Message model
const cookieParser = require('cookie-parser');
const authenticate = require('../middleware/auth'); 

// Mock implementations
jest.mock('../models/user');
jest.mock('../models/message');
jest.mock('./email', () => ({
    sendEmail: jest.fn(),
}));

// In-memory mock data
const users = [];
const messages = [];

// Mock User methods
User.findOne = jest.fn((query) => {
    return Promise.resolve(users.find((user) => 
        user.username === query.username || user.email === query.email));
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

// Add routes
app.post('/register', auth.register);
app.post('/login', auth.login);
app.post('/logout', auth.logout);

// Test suites
describe('Auth API', () => {
    beforeEach(() => {
        users.length = 0; // Clear users array
        messages.length = 0; // Clear messages array
        jest.clearAllMocks(); // Reset mock implementations
    });

    describe('POST /register', () => {
        it('should register a new user and send a welcome email', async () => {
            const newUser = {
                username: 'testuser',
                email: 'test@example.com',
                password: await bcrypt.hash('password123', 10),
            };

            const response = await request(app)
                .post('/register')
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User successfully registered!');
            expect(users.length).toBe(1);
            expect(messages.length).toBe(1); // Ensure welcome message is created
        });

        it('should not allow duplicate username or email', async () => {
            const existingUser = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            };

            users.push(existingUser);

            const response = await request(app)
                .post('/register')
                .send(existingUser);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username or email already exists');
        });
    });

    describe('POST /login', () => {
        it('should log in an existing user and return a token', async () => {
            const password = await bcrypt.hash('password123', 10);
            users.push({
                username: 'testuser',
                password: password,
            });

            const response = await request(app)
                .post('/login')
                .send({ username: 'testuser', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Welcome testuser');
            expect(response.headers['set-cookie']).toBeDefined(); // Ensure cookie is set
        });

        it('should return error for incorrect credentials', async () => {
            const password = await bcrypt.hash('password123', 10);
            users.push({
                username: 'testuser',
                password: password,
            });

            const response = await request(app)
                .post('/login')
                .send({ username: 'testuser', password: 'wrongpassword' });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Incorrect username or password');
        });
    });

    describe('POST /logout', () => {
        it('should clear the authentication token cookie', async () => {
            const response = await request(app).post('/logout');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Logout successful');
            expect(response.headers['set-cookie']).toBeDefined();
        });
    });
    
    // Middleware test suite
    describe('Authenticate Middleware', () => {
        const SECRET_KEY = 'test-secret-key'; // Use a test secret key
        let server;
    
        beforeAll(() => {
            process.env.SECRET_KEY = SECRET_KEY;
    
            const app = express();
            app.use(cookieParser());
            app.use(authenticate);
    
            app.get('/protected-route', (req, res) => {
                res.status(200).json({ authenticated: true, user: req.user });
            });
    
            server = app.listen(3001); // Start server for middleware testing
        });
    
        afterAll(() => {
            server.close();
        });
    
        it('should return 401 if the token is expired', async () => {
            const expiredToken = jwt.sign(
                { userId: 'testUserId' },
                SECRET_KEY,
                { expiresIn: -1 } // Immediately expired
            );
    
            const res = await request(server)
                .get('/protected-route')
                .set('Cookie', `token=${expiredToken}`);
    
            expect(res.status).toBe(401);
            expect(res.body.authenticated).toBe(false);
            expect(res.body.message).toBe('Token expired');
        });
    
        it('should return 401 if no token is provided', async () => {
            const res = await request(server).get('/protected-route');
    
            expect(res.status).toBe(401);
            expect(res.body.authenticated).toBe(false);
            expect(res.body.message).toBe('Authentication required');
        });
    
        it('should return 401 if the token is invalid', async () => {
            const invalidToken = 'invalidTokenValue';
    
            const res = await request(server)
                .get('/protected-route')
                .set('Cookie', `token=${invalidToken}`);
    
            expect(res.status).toBe(401);
            expect(res.body.authenticated).toBe(false);
            expect(res.body.message).toBe('Invalid token');
        });
    
        it('should pass and authenticate user if token is valid', async () => {
            const validToken = jwt.sign(
                { userId: 'testUserId' },
                SECRET_KEY,
                { expiresIn: '1h' } // Valid for 1 hour
            );
    
            const res = await request(server)
                .get('/protected-route')
                .set('Cookie', `token=${validToken}`);
    
            expect(res.status).toBe(200);
            expect(res.body.authenticated).toBe(true);
            expect(res.body.user).toBeDefined();
        });
    });    

});
