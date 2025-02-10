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

/**
 * Helper function to extract the Cloudinary public ID from an image URL.
 * Assumes the URL follows a format like:
 *   https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/folder/filename.extension
 * This function removes the version segment (e.g., "v1234567890/") and the file extension.
 */
function extractPublicId(url) {
    const parts = url.split('/upload/')
    if (parts.length < 2) return null

    let publicIdWithExtension = parts[1].split('?')[0]
    publicIdWithExtension = publicIdWithExtension.replace(/^v\d+\//, '')
    const dotIndex = publicIdWithExtension.lastIndexOf('.')
    if (dotIndex !== -1) {
        return publicIdWithExtension.substring(0, dotIndex)
    }
    return publicIdWithExtension
}

module.exports = { uploadImage, extractPublicId }
