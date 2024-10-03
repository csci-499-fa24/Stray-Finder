const User = require('../models/user');

const createUser = async (req, res) => {
    const{ username, password } = req.body;

    if (!username || !password){ // checks that the email and password are filled in
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // creates a new user and the schema requires unique username
        const newUser = await User.create({ username, password });

        res.status(201).json({ message: 'User created successfully!'});
    } catch (error){
        // duplicate username error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User not created. Username already exist.' });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }

        // ambiguous error message
        console.error('Error: ', error);
        res.status(500).json({ message: 'User not created. Internal server error.' });
    }

};

module.exports = { 
    createUser 
};