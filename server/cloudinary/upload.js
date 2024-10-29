const cloudinary = require('./config')

const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'animals' },
            (error, result) => {
                if (error) {
                    return reject(error)
                }
                resolve(result.secure_url) // Return Cloudinary image URL
            }
        )

        // Pass the buffer to the stream
        uploadStream.end(file.buffer)
    })
}

module.exports = uploadImage
