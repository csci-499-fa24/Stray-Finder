jest.mock('cloudinary', () => ({
    v2: {
      config: jest.fn(),
    },
  }));
  
  describe('Cloudinary Config', () => {
    let originalEnv;
  
    beforeEach(() => {
      originalEnv = { ...process.env }; // Save the original environment variables
    });
  
    afterEach(() => {
      process.env = originalEnv; // Restore the original environment variables
      jest.resetModules(); // Reset module cache to reload the config file
    });
  
    test('throws an error if CLOUDINARY_URL is incorrectly formatted', () => {
      process.env.CLOUDINARY_URL = 'invalid_url_format'; // Set an invalid URL
  
      expect(() => require('../cloudinary/config')).toThrowError(
        'CLOUDINARY_URL is not in the expected format: cloudinary://api_key:api_secret@cloud_name'
      );
    });
  
    test('successfully configures Cloudinary with valid CLOUDINARY_URL', () => {
      process.env.CLOUDINARY_URL = 'cloudinary://1234567890:secret@mycloudname';
  
      jest.resetModules(); // Reset the module cache to reapply mocks
      const cloudinary = require('cloudinary').v2; // Re-import after resetting
  
      require('../cloudinary/config'); // Load the config file
      expect(cloudinary.config).toHaveBeenCalledWith({
        cloud_name: 'mycloudname',
        api_key: '1234567890',
        api_secret: 'secret',
      });
    });
  });
  