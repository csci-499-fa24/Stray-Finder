const compareLocation = require('./comparisons/compareLocation')
const compareDescription = require('./comparisons/compareDescription')
const compareDateReported = require('./comparisons/compareDateReported')
const compareAnimal = require('./comparisons/compareAnimal')
const compareImage = require('./comparisons/compareImage')

// Helper function to aggregate individual scores into a final match score
const aggregateScores = (scores) => {
    const weights = {
        locationScore: 0.35,
        animalScore: 0.3,
        imageScore: 0.2,
        descriptionScore: 0.05,
        dateReportedScore: 0.1,
    }

    return (
        scores.locationScore * weights.locationScore +
        scores.animalScore * weights.animalScore +
        scores.imageScore * weights.imageScore +
        scores.descriptionScore * weights.descriptionScore +
        scores.dateReportedScore * weights.dateReportedScore
    )
}

const calculateMatchScore = async (report1, report2) => {
    const locationScore = compareLocation(report1.location, report2.location)
    const animalScore = compareAnimal(report1.animal, report2.animal)
    const descriptionScore = compareDescription(
        report1.description,
        report2.description
    )
    const dateReportedScore = compareDateReported(
        report1.dateReported,
        report2.dateReported
    )

    // Ensure that both reports contain animal data
    if (!report1.animal || !report2.animal) {
        throw new Error('Animal data is missing in one of the reports')
    }

    // Calculate image score by comparing the feature vectors of each animal's image
    const imageScore = await compareImage(
        report1.animal.imageUrl,
        report1.animal._id,
        report2.animal.imageUrl,
        report2.animal._id
    )

    // Aggregate all scores, including imageScore
    return aggregateScores({
        locationScore,
        animalScore,
        imageScore,
        descriptionScore,
        dateReportedScore,
    })
}

module.exports = { calculateMatchScore }
