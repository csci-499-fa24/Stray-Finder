const compareSpecies = (species1, species2) => {
    if (!species1 || !species2) return 0.2 // Low score if species is unknown
    return species1.toLowerCase() === species2.toLowerCase() ? 1 : 0 // High penalty for mismatch
}

const compareBreed = (breed1, breed2) => {
    if (breed1 === "I don't know" || breed2 === "I don't know") return 0.4

    // Standardize breed names to lowercase for consistent comparison
    breed1 = breed1.toLowerCase()
    breed2 = breed2.toLowerCase()

    // Return 100% match for exact breed match
    if (breed1 === breed2) return 1

    // Define similar breed groups for cats and dogs
    const breedGroups = {
        cat: [
            ['persian', 'himalayan', 'exotic shorthair'], // Group 1: Similar flat-faced breeds
            ['siamese', 'balinese', 'oriental shorthair'], // Group 2: Similar slender breeds
            ['maine coon', 'norwegian forest cat'], // Group 3: Large, similar long-haired cats
            // Add more groups as needed
        ],
        dog: [
            ['labrador retriever', 'golden retriever'], // Group 1: Similar retriever breeds
            ['german shepherd', 'belgian malinois'], // Group 2: Similar working breeds
            ['bulldog', 'french bulldog', 'pug'], // Group 3: Brachycephalic dogs
            ['siberian husky', 'alaskan malamute'], // Group 4: Northern sled dogs
            // Add more groups as needed
        ],
    }

    // Helper function to check if two breeds are in the same group
    const isInSameGroup = (breed1, breed2, groups) => {
        return groups.some(
            (group) => group.includes(breed1) && group.includes(breed2)
        )
    }

    // Determine if breeds are similar based on defined groups
    if (
        isInSameGroup(breed1, breed2, breedGroups.cat) ||
        isInSameGroup(breed1, breed2, breedGroups.dog)
    ) {
        return 0.7 // Adjusted similarity score for similar breeds
    }

    // Return a lower score if breeds do not match or belong to any similar group
    return 0.3
}

const compareColor = (color1, color2) => {
    // 50% if either color is unknown or not provided
    if (!color1 || !color2) return 0.5

    // 100% match for exact color match
    if (color1.toLowerCase() === color2.toLowerCase()) return 1

    const colorGroups = [
        ['black', 'dark gray', 'charcoal'], // Group 1: Dark colors
        ['gray', 'silver', 'light gray'], // Group 2: Light gray tones
        ['brown', 'tan', 'chocolate'], // Group 3: Brownish tones
        ['white', 'cream', 'ivory'], // Group 4: Light colors
        ['orange', 'ginger', 'red'], // Group 5: Reddish tones
        ['yellow', 'gold', 'blonde'], // Group 6: Yellowish tones
        // More to be added
    ]

    // Helper function to check if two colors are in the same group
    const isInSameGroup = (color1, color2, groups) => {
        return groups.some(
            (group) =>
                group.includes(color1.toLowerCase()) &&
                group.includes(color2.toLowerCase())
        )
    }

    // Determine if colors are similar based on the defined groups
    if (isInSameGroup(color1, color2, colorGroups)) {
        return 0.8 // High similarity score for colors in the same group
    }

    // Return a lower score if colors do not match or belong to any similar group
    return 0.3
}

const compareGender = (gender1, gender2) => {
    // 50% if either or is Unknown
    if (gender1 === 'Unknown' || gender2 === 'Unknown') return 0.5

    // 100% for a match
    if (gender1 === gender2) return 1

    // 20% incase of mistaken gender
    return 0.2
}

const compareFixedStatus = (fixed1, fixed2) => {
    // 50% if either or is Unknown
    if (fixed1 === 'Unknown' || fixed2 === 'Unknown') return 0.5

    // 100% for a match
    if (fixed1 === fixed2) return 1

    // 20% incase of mistaken status
    return 0.2
}

// to be updated later for when a string is added to collar. idk why i ever made it a boolean kinda dumb
const compareCollarStatus = (collar1, collar2) => {
    if (collar1 === collar2) return 1
    if (!collar1 && !collar2) return 0.4 // Slightly lower if both have no collar
    return 0
}

// Aggregation function with weighting
const aggregateAnimalScores = (scores) => {
    const weights = {
        speciesScore: 0.4, // Highest weight for species
        breedScore: 0.2, // Second most important
        colorScore: 0.15, // Moderate importance
        genderScore: 0.1, // Moderate-low importance
        fixedScore: 0.1, // Moderate-low importance
        collarScore: 0.05, // Least important (for now)
    }

    // Calculate the weighted score by multiplying each score by its weight
    const weightedScore =
        scores.speciesScore * weights.speciesScore +
        scores.breedScore * weights.breedScore +
        scores.colorScore * weights.colorScore +
        scores.genderScore * weights.genderScore +
        scores.fixedScore * weights.fixedScore +
        scores.collarScore * weights.collarScore

    return weightedScore
}

const compareAnimal = (animal1, animal2) => {
    const speciesScore = compareSpecies(animal1.species, animal2.species)
    const breedScore = compareBreed(animal1.breed, animal2.breed)
    const colorScore = compareColor(animal1.color, animal2.color)
    const genderScore = compareGender(animal1.gender, animal2.gender)
    const fixedScore = compareFixedStatus(animal1.fixed, animal2.fixed)
    const collarScore = compareCollarStatus(animal1.collar, animal2.collar)

    return aggregateAnimalScores({
        speciesScore,
        breedScore,
        colorScore,
        genderScore,
        fixedScore,
        collarScore,
    })
}

module.exports = compareAnimal
