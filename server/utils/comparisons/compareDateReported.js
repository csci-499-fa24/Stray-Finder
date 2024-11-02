const compareDateReported = (date1, date2) => {
    // Convert dates to milliseconds for comparison
    const date1Ms = new Date(date1).getTime()
    const date2Ms = new Date(date2).getTime()

    // Calculate the absolute difference in days
    const msPerDay = 1000 * 60 * 60 * 24
    const daysDifference = Math.abs(date1Ms - date2Ms) / msPerDay

    // Scoring based on days difference
    if (daysDifference <= 1) return 1 // 100% match if within 1 day
    else if (daysDifference <= 3) return 0.95
    else if (daysDifference <= 7) return 0.9
    else if (daysDifference <= 14) return 0.85
    else if (daysDifference <= 30) return 0.8
    else if (daysDifference <= 60) return 0.7
    else if (daysDifference <= 90) return 0.6
    else return Math.max(0, 0.6 - (daysDifference - 90) * 0.001) // Gradual decrease beyond 3 months
}

module.exports = compareDateReported