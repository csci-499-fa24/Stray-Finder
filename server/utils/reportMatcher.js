const compareLocation = require('./comparisons/compareLocation')
const compareDescription = require('./comparisons/compareDescription')
const compareDateReported = require('./comparisons/compareDateReported')
const compareAnimal = require('./comparisons/compareAnimal')

// Helper function to aggregate individual scores into a final match score
const aggregateScores = (scores) => {
    const weights = {
        locationScore: 0.35,
        animalScore: 0.45,
        descriptionScore: 0.08,
        dateReportedScore: 0.12,
    };

    // Calculate the weighted score
    const weightedScore = 
        (scores.locationScore * weights.locationScore) +
        (scores.animalScore * weights.animalScore) +
        (scores.descriptionScore * weights.descriptionScore) +
        (scores.dateReportedScore * weights.dateReportedScore);

    return weightedScore;
};


const calculateMatchScore = (report1, report2) => {
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

    // Aggregate all scores and calculate final score
    return aggregateScores({
        locationScore,
        animalScore,
        descriptionScore,
        dateReportedScore,
    })
}

module.exports = {
    calculateMatchScore,
}
