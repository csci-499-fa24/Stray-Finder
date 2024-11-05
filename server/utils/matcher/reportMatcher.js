const compareLocation = require('./comparisons/compareLocation')
const compareDescription = require('./comparisons/compareDescription')
const compareDateReported = require('./comparisons/compareDateReported')
const compareAnimal = require('./comparisons/compareAnimal')
// const compareImage = require('./comparisons/compareImage') // Commented out

// Helper function to aggregate individual scores into a final match score
const aggregateScores = (scores) => {
    // Redistributed weights without imageScore
    const weights = {
        locationScore: 0.4375, // 0.35 + (0.2 * 0.35)
        animalScore: 0.375, // 0.3 + (0.2 * 0.3)
        descriptionScore: 0.0625, // 0.05 + (0.2 * 0.05)
        dateReportedScore: 0.125, // 0.1 + (0.2 * 0.1)
    }

    return (
        scores.locationScore * weights.locationScore +
        scores.animalScore * weights.animalScore +
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

    // Aggregate all scores, excluding imageScore
    return aggregateScores({
        locationScore,
        animalScore,
        descriptionScore,
        dateReportedScore,
    })
}

module.exports = { calculateMatchScore }
