// Compares proximity
const compareLocation = (location1, location2) => {
    const R = 3958.8 // Radius of Earth in miles
    const lat1 = location1.coordinates[1]
    const lon1 = location1.coordinates[0]
    const lat2 = location2.coordinates[1]
    const lon2 = location2.coordinates[0]

    // Haversine formula to calculate distance between two coordinates
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in miles

    // Scoring based on distance
    if (distance <= 0.2) return 1 // 100% match
    else if (distance <= 0.5) return 0.95
    else if (distance <= 1) return 0.9
    else if (distance <= 2) return 0.85
    else if (distance <= 3) return 0.8
    else if (distance <= 4) return 0.75
    else if (distance <= 5) return 0.7
    else return Math.max(0, 0.7 - (distance - 5) * 0.05) // Gradually decreases beyond 5 miles
}

module.exports = compareLocation