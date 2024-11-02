const compareDateReported = (date1, date2) => {
    const date1Ms = new Date(date1).getTime()
    const date2Ms = new Date(date2).getTime()
    const msPerDay = 1000 * 60 * 60 * 24
    const daysDifference = Math.abs(date1Ms - date2Ms) / msPerDay

    if (daysDifference <= 1) return 1
    else if (daysDifference <= 3) return 0.9
    else if (daysDifference <= 7) return 0.75
    else if (daysDifference <= 14) return 0.5
    else if (daysDifference <= 30) return 0.3
    else return 0.1 // Lower score for dates significantly far apart
}

module.exports = compareDateReported

module.exports = compareDateReported
