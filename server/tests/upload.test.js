// tests/cloudinary/upload.test.js
const uploadImage = require('../../server/cloudinary/upload');
const cloudinary = require('../../server/cloudinary/config');

jest.mock('../../server/cloudinary/config', () => ({
    uploader: {
        upload_stream: jest.fn(),
    },
}));

describe('uploadImage', () => {
    it('should upload an image and return the URL', async () => {
        const mockFile = { buffer: Buffer.from('mock file data') };
        const mockUrl = 'http://cloudinary.com/mock-image.jpg';

        // Mock the Cloudinary upload_stream behavior
        cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
            return {
                end: () => {
                    callback(null, { secure_url: mockUrl });
                },
            };
        });

        const result = await uploadImage(mockFile);
        expect(result).toBe(mockUrl);
    });

    it('should reject with an error if the upload fails', async () => {
        const mockFile = { buffer: Buffer.from('mock file data') };
        const mockError = new Error('Upload failed');

        // Mock the Cloudinary upload_stream to simulate an error
        cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
            return {
                end: () => {
                    callback(mockError, null);
                },
            };
        });

        await expect(uploadImage(mockFile)).rejects.toThrow('Upload failed');
    });
});
