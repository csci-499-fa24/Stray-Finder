require('dotenv').config(); // Load environment variables

const { sendMessage, getMessages, retrieveAllUsers, getLastMessages, markMessagesAsRead } = require('../controllers/message');
const Message = require('../models/message');
const User = require('../models/user');

jest.mock('../models/message');
jest.mock('../models/user');

describe('Message Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { _id: '123' },
            params: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('sendMessage', () => {
        it('should return 400 if recipientId or content is missing', async () => {
            req.params.recipientId = null;
            req.body.content = null;

            await sendMessage(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Recipient and content are required' });
        });

        it('should return 404 if recipient is not found', async () => {
            req.params.recipientId = '456';
            req.body.content = 'Hello';

            User.findById.mockResolvedValue(null);

            await sendMessage(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Recipient not found' });
        });

        it('should save the message and send a notification', async () => {
            req.params.recipientId = '456';
            req.body.content = 'Hello';

            const recipient = { email: 'test@example.com', username: 'recipient', notificationPreference: 'immediate' };
            const sender = { username: 'sender' };

            User.findById
                .mockResolvedValueOnce(recipient)
                .mockResolvedValueOnce(sender);
            Message.prototype.save = jest.fn().mockResolvedValue({ id: 'message123' });

            await sendMessage(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: 'message123' });
        });

        it('should handle errors and return 500', async () => {
            req.params.recipientId = '456';
            req.body.content = 'Hello';

            Message.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

            await sendMessage(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Failed to send message', error: 'Database error' });
        });
    });

    describe('getMessages', () => {
        it('should fetch and return messages between two users', async () => {
            req.params.otherUserId = '456';

            const messages = [
                { content: 'Hello', senderId: '123', recipientId: '456' }
            ];

            Message.find.mockResolvedValue(messages);

            await getMessages(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(messages);
        });

        it('should handle errors and return 500', async () => {
            req.params.otherUserId = '456';

            Message.find.mockRejectedValue(new Error('Database error'));

            await getMessages(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Failed to get messages', error: 'Database error' });
        });
    });

    describe('retrieveAllUsers', () => {
        it('should return a list of users the current user has messaged', async () => {
            const messages = [
                { senderId: '123', recipientId: '456' },
                { senderId: '456', recipientId: '123' }
            ];
            const users = [{ _id: '456', username: 'recipient', profileImage: null }];

            Message.find.mockResolvedValue(messages);
            User.find.mockResolvedValue(users);

            await retrieveAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([ 
                { id: '456', username: 'recipient', profileImage: null }
            ]);
        });

        it('should handle errors and return 500', async () => {
            Message.find.mockRejectedValue(new Error('Database error'));

            await retrieveAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving users' });
        });
    });

    describe('getLastMessages', () => {
        it('should return the last messages with each user', async () => {
            const messages = [
                { _id: '456', lastMessage: 'Hello', timestamp: new Date(), senderId: '123', read: true }
            ];
            const users = [{ _id: '456', username: 'recipient', profileImage: null }];

            Message.aggregate.mockResolvedValue(messages);
            User.find.mockResolvedValue(users);

            await getLastMessages(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                {
                    id: '456',
                    username: 'recipient',
                    profileImage: null,
                    lastMessage: 'Hello',
                    timestamp: messages[0].timestamp,
                    senderId: '123',
                    read: true
                }
            ]);
        });

        it('should handle errors and return 500', async () => {
            Message.aggregate.mockRejectedValue(new Error('Database error'));

            await getLastMessages(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving last messages' });
        });
    });

    describe('markMessagesAsRead', () => {
        it('should mark messages as read', async () => {
            req.params.recipientId = '456';

            Message.updateMany.mockResolvedValue({ modifiedCount: 1 });

            await markMessagesAsRead(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Messages marked as read' });
        });

        it('should handle errors and return 500', async () => {
            Message.updateMany.mockRejectedValue(new Error('Database error'));

            await markMessagesAsRead(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Failed to mark messages as read', error: 'Database error' });
        });
    });
});
