const cloudinary = require('cloudinary').v2
require('dotenv').config() // Ensure dotenv is loaded

// Configure Cloudinary using CLOUDINARY_URL
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_URL.split('@')[1],
    api_key: process.env.CLOUDINARY_URL.split('://')[1].split(':')[0],
    api_secret: process.env.CLOUDINARY_URL.split(':')[2].split('@')[0],
})

module.exports = cloudinary
