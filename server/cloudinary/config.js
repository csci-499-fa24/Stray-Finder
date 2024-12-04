const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Ensure dotenv is loaded

// Check if CLOUDINARY_URL is defined and formatted correctly
if (!process.env.CLOUDINARY_URL) {
  throw new Error('CLOUDINARY_URL environment variable is not set');
}

// Use a regex to safely parse the CLOUDINARY_URL
const cloudinaryUrl = process.env.CLOUDINARY_URL.match(
  /cloudinary:\/\/([^:]+):([^@]+)@([^\/]+)/
);

if (!cloudinaryUrl) {
  throw new Error('CLOUDINARY_URL is not in the expected format: cloudinary://api_key:api_secret@cloud_name');
}

cloudinary.config({
  cloud_name: cloudinaryUrl[3], // cloud_name
  api_key: cloudinaryUrl[1],   // api_key
  api_secret: cloudinaryUrl[2], // api_secret
});

module.exports = cloudinary;
