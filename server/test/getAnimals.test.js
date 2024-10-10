const { getAnimals } = require('../controllers/animals');
const Animal = require('../models/animals');

jest.mock('../models/animals'); // Mock the Animal model

describe('getAnimals', () => {
    let req, res;

    beforeEach(() => {
        req = {}; // Mock request object
        res = {
            status: jest.fn().mockReturnThis(), // Chainable mock function for response
            json: jest.fn(), // Mock json response function
        };
    });

    it('should return a list of animals successfully', async () => {
        // Mock the return value for Animal.find()
        const mockAnimals = [
            { _id: '1', species: 'Dog', breed: 'Labrador' },
            { _id: '2', species: 'Cat', breed: 'Siamese' },
        ];
        Animal.find.mockResolvedValue(mockAnimals); // Mock resolved value

        await getAnimals(req, res); // Call the controller

        // Check that the response status and json method were called with the correct data
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ animals: mockAnimals });
    });

    it('should handle errors properly', async () => {
        const errorMessage = 'Database error';
        Animal.find.mockRejectedValue(new Error(errorMessage)); // Mock rejection

        await getAnimals(req, res); // Call the controller

        // Check that the response status and json method were called for error handling
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Failed to fetch animals',
            error: errorMessage,
        });
    });
});