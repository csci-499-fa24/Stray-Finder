// List of common words to ignore
const ignoreWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'if',
    'then',
    'of',
    'at',
    'by',
    'for',
    'with',
    'about',
    'against',
    'between',
    'to',
    'from',
    'up',
    'down',
    'in',
    'out',
    'on',
    'off',
    'over',
    'under',
    'again',
    'further',
    'once',
    'here',
    'there',
    'when',
    'where',
    'why',
    'how',
    'all',
    'any',
    'both',
    'each',
    'few',
    'more',
    'some',
    'such',
    'no',
    'nor',
    'not',
    'only',
    'own',
    'same',
    'so',
    'than',
    'too',
    'very',
])

const compareDescription = (description1, description2) => {
    // Function to extract important words from a description
    const extractKeywords = (description) => {
        return description
            .toLowerCase() // Convert to lowercase
            .replace(/[^a-z\s]/g, '') // Remove punctuation
            .split(/\s+/) // Split into words
            .filter((word) => !ignoreWords.has(word)) // Filter out common words
    }

    // Extract keywords from both descriptions
    const words1 = new Set(extractKeywords(description1))
    const words2 = new Set(extractKeywords(description2))

    // Find the common words of both sets
    const commonWords = [...words1].filter((word) => words2.has(word))

    // Calculate similarity score: number of matches over the average unique words
    const totalUniqueWords = new Set([...words1, ...words2]).size
    const score =
        totalUniqueWords === 0 ? 0 : commonWords.length / totalUniqueWords

    return score
}

module.exports = compareDescription