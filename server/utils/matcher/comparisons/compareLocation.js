const compareLocation = (location1, location2) => {
    if (
        !location1 ||
        !location2 ||
        !location1.coordinates ||
        !location2.coordinates
    )
        return 0

    const [lon1, lat1] = location1.coordinates.coordinates
    const [lon2, lat2] = location2.coordinates.coordinates

    const R = 3958.8 // Radius of Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    if (distance <= 0.5) return 1
    else if (distance <= 1) return 0.9
    else if (distance <= 1.5) return 0.7
    else if (distance <= 3) return 0.4 // Sharper drop
    else if (distance <= 5) return 0.25 // Further drop for distances
    else return Math.max(0, 0.25 - (distance - 3) * 0.1) // Steady decline after 3 miles
}

module.exports = compareLocation

module.exports = compareLocation
