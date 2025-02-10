// tests/controllers/profile.test.js
const { uploadProfileImage } = require('../../server/controllers/profile');
const User = require('../../server/models/user');
const {uploadImage} = require('../../server/cloudinary/utils');

jest.mock('../../server/models/user');
jest.mock('../../server/cloudinary/utils');

describe('uploadProfileImage', () => {
    let req, res;

    beforeEach(() => {
        req = {
            file: { originalname: 'test.jpg' },
            user: { _id: 'user123' },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it('should return 400 if no file is provided', async () => {
        req.file = null;

        await uploadProfileImage(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'No image file provided' });
    });

    it('should upload the image and update the user profile', async () => {
        const mockImageUrl = 'http://cloudinary.com/test.jpg';
        const mockUser = { _id: 'user123', profileImage: mockImageUrl };

        uploadImage.mockResolvedValue(mockImageUrl);
        User.findByIdAndUpdate.mockResolvedValue(mockUser);

        await uploadProfileImage(req, res);

        expect(uploadImage).toHaveBeenCalledWith(req.file);
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
            req.user._id,
            { profileImage: mockImageUrl },
            { new: true }
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ profileImage: mockImageUrl });
    });

    it('should return 404 if user is not found', async () => {
        uploadImage.mockResolvedValue('http://cloudinary.com/test.jpg');
        User.findByIdAndUpdate.mockResolvedValue(null);

        await uploadProfileImage(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 if an error occurs', async () => {
        const error = new Error('Database error');
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
    
        uploadImage.mockResolvedValue('http://cloudinary.com/test.jpg');
        User.findByIdAndUpdate.mockRejectedValue(error);
    
        await uploadProfileImage(req, res);
    
        expect(console.error).toHaveBeenCalledWith('Error uploading profile image:', error.message);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Failed to upload profile image' });
    
        console.error.mockRestore(); // Restore the original implementation
    });
});
