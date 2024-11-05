const { exec } = require('child_process')
const path = require('path')
const FeatureVector = require('../../../models/FeatureVector')
const { generateFeatureVector } = require('../../FeatureVectorUtils')

// In-memory cache for feature vectors
const featureCache = new Map()

// Function to retrieve or generate feature vector for an animal
const getCachedFeatures = async (imageUrl, animalId) => {
    if (!imageUrl) {
        return null
    }

    if (featureCache.has(imageUrl)) {
        return featureCache.get(imageUrl)
    }

    try {
        const featureVectorDoc = await FeatureVector.findOne({ animalId })
        if (featureVectorDoc && featureVectorDoc.vector.length) {
            featureCache.set(imageUrl, featureVectorDoc.vector)
            return featureVectorDoc.vector
        }

        const featureVector = await generateFeatureVector(imageUrl)
        featureCache.set(imageUrl, featureVector)

        await FeatureVector.findOneAndUpdate(
            { animalId },
            { vector: featureVector },
            { upsert: true, new: true }
        )

        return featureVector
    } catch (error) {
        console.error('Error generating or saving feature vector:', error)
        throw error
    }
}

// Helper function to flatten nested arrays, if any
const flattenArray = (array) => array.flat()

// Function to calculate cosine similarity between two feature vectors
const cosineSimilarity = (vectorA, vectorB) => {
    vectorA = flattenArray(vectorA)
    vectorB = flattenArray(vectorB)

    const dotProduct = vectorA.reduce(
        (sum, val, index) => sum + val * vectorB[index],
        0
    )
    const magnitudeA = Math.sqrt(
        vectorA.reduce((sum, val) => sum + val * val, 0)
    )
    const magnitudeB = Math.sqrt(
        vectorB.reduce((sum, val) => sum + val * val, 0)
    )

    return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0
}

// Main function to compare two images by their feature vectors
const compareImage = async (imageUrl1, animalId1, imageUrl2, animalId2) => {
    try {
        // Return a default similarity score if either image URL is missing
        if (!imageUrl1 || !imageUrl2) {
            return 0.5
        }

        const features1 = await getCachedFeatures(imageUrl1, animalId1)
        const features2 = await getCachedFeatures(imageUrl2, animalId2)

        if (!features1 || !features2) {
            console.error(
                `Missing features for comparison: ${imageUrl1} or ${imageUrl2}`
            )
            return 0
        }

        const similarityScore = cosineSimilarity(features1, features2)
        return similarityScore
    } catch (error) {
        console.error('Error comparing images:', error)
        return 0
    }
}

module.exports = compareImage