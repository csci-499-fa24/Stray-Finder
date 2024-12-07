const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { saveComment, getComments, getCommentCount } = require('../controllers/comment');
const Comment = require('../models/comment');
const AnimalReport = require('../models/animalReport');
const Notification = require('../models/notification');

jest.mock('../models/comment');
jest.mock('../models/animalReport');
jest.mock('../models/notification');

const app = express();

app.use(express.json());
app.use(cors());

// Routes for testing
app.post('/api/comments/:reportId', saveComment);
app.get('/api/comments/:reportId', getComments);
app.get('/api/comments/:reportId/count', getCommentCount);

describe('Comment Controller', () => {
  const mockUserId = 'user123';
  const mockReportId = 'report123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/comments/:reportId', () => {
/*    it('should save a new comment', async () => {
      const mockComment = {
        content: 'Test comment',
        reportId: mockReportId,
        userId: mockUserId,
        populate: jest.fn().mockResolvedValue({
          username: 'testUser',
          profileImage: 'testImageUrl',
        }),
      };

      Comment.prototype.save = jest.fn().mockResolvedValue(mockComment);
      AnimalReport.findById = jest.fn().mockResolvedValue({
        reportedBy: 'user456',
        animal: {
          name: 'Fluffy',
          species: 'Cat',
          imageUrl: 'image.jpg',
          description: 'A friendly cat.',
        },
      });
      Notification.create = jest.fn().mockResolvedValue({});

      const response = await request(app)
        .post(`/api/comments/${mockReportId}`)
        .send({ content: 'Test comment' })
        .set('Authorization', `Bearer mockToken`);

      expect(response.status).toBe(201);
      expect(Comment.prototype.save).toHaveBeenCalled();
      expect(Notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user456',
          type: 'comment',
        })
      );
    });
*/
    it('should return 400 if content is missing', async () => {
      const response = await request(app)
        .post(`/api/comments/${mockReportId}`)
        .send({})
        .set('Authorization', `Bearer mockToken`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Comment content is required');
    });

    it('should return 500 on server error', async () => {
      Comment.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post(`/api/comments/${mockReportId}`)
        .send({ content: 'Test comment' })
        .set('Authorization', `Bearer mockToken`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to save comment');
    });
  });

  describe('GET /api/comments/:reportId', () => {
    it('should fetch all comments for a report', async () => {
      const mockComments = [
        { content: 'First comment', userId: { username: 'user1', profileImage: 'image1' } },
        { content: 'Second comment', userId: { username: 'user2', profileImage: 'image2' } },
      ];

      Comment.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockComments),
        }),
      });

      const response = await request(app).get(`/api/comments/${mockReportId}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body).toEqual(mockComments);
    });

/*    it('should return 500 on server error', async () => {
      Comment.find = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get(`/api/comments/${mockReportId}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to fetch comments');
    });*/
  });

  describe('GET /api/comments/:reportId/count', () => {
    it('should fetch the comment count for a report', async () => {
      Comment.countDocuments = jest.fn().mockResolvedValue(5);

      const response = await request(app).get(`/api/comments/${mockReportId}/count`);

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(5);
    });

    it('should return 500 on server error', async () => {
      Comment.countDocuments = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app).get(`/api/comments/${mockReportId}/count`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to fetch comment count');
    });
  });
});
