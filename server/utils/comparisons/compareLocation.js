const compareLocation = (location1, location2) => {
    if (
        !location1 ||
        !location2 ||
        !location1.coordinates ||
        !location2.coordinates
    ) {
        console.error('Invalid location data:', location1, location2)
        return 0
    }

    const [lon1, lat1] = location1.coordinates.coordinates
    const [lon2, lat2] = location2.coordinates.coordinates

    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
        console.error('Invalid coordinates:', lat1, lon1, lat2, lon2)
        return 0
    }

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
    const distance = R * c // Distance in miles

    if (distance <= 0.2) return 1
    else if (distance <= 0.5) return 0.95
    else if (distance <= 1) return 0.9
    else if (distance <= 2) return 0.85
    else if (distance <= 3) return 0.8
    else if (distance <= 4) return 0.75
    else if (distance <= 5) return 0.7
    else return Math.max(0, 0.7 - (distance - 5) * 0.05)
}

module.exports = compareLocation
