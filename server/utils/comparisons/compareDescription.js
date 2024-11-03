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
    const extractKeywords = (description) => {
        return description
            .toLowerCase()
            .replace(/[^a-z\s]/g, '')
            .split(/\s+/)
            .filter((word) => !ignoreWords.has(word))
    }

    const words1 = new Set(extractKeywords(description1))
    const words2 = new Set(extractKeywords(description2))
    const commonWords = [...words1].filter((word) => words2.has(word))

    const totalUniqueWords = new Set([...words1, ...words2]).size
    const score =
        totalUniqueWords === 0 ? 0 : commonWords.length / totalUniqueWords

    return Math.min(score, 0.5) // Ensures description score does not overly influence the match
}

module.exports = compareDescription
