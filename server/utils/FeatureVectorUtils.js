const { exec } = require('child_process')
const path = require('path')
const FeatureVector = require('../models/FeatureVector')

const generateFeatureVector = (imageUrl) => {
    return new Promise((resolve, reject) => {
        const pythonScriptPath = path.join(
            __dirname,
            './python/image_feature_extraction.py'
        )
        exec(
            `python3 ${pythonScriptPath} ${imageUrl}`,
            (error, stdout, stderr) => {
                if (error) return reject(error)
                try {
                    const result = JSON.parse(stdout)
                    resolve(result.features)
                } catch (err) {
                    reject(err)
                }
            }
        )
    })
}

const createOrUpdateFeatureVector = async (animalId, imageUrl) => {
    try {
        // Generate the feature vector
        const vectorData = await generateFeatureVector(imageUrl)

        // Check if a feature vector already exists for the animal
        const existingVector = await FeatureVector.findOne({ animalId })
        if (existingVector) {
            // Update existing feature vector
            existingVector.vector = vectorData
            await existingVector.save()
        } else {
            // Create a new feature vector
            const newVector = new FeatureVector({
                animalId,
                vector: vectorData,
            })
            await newVector.save()
        }
    } catch (error) {
        console.error('Error creating/updating feature vector:', error.message)
    }
}

module.exports = {generateFeatureVector, createOrUpdateFeatureVector}

