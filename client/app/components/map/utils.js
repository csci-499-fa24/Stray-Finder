export const calculateBounds = (center, radiusInMiles) => {
    const radiusInMeters = radiusInMiles * 1609.34
    const latDelta = (radiusInMeters / 6378137) * (180 / Math.PI)
    const lngDelta = latDelta / Math.cos(center.lat * (Math.PI / 180))
    return {
        north: center.lat + latDelta,
        south: center.lat - latDelta,
        east: center.lng + lngDelta,
        west: center.lng - lngDelta,
    }
}

export const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 3961
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLng = (lng2 - lng1) * (Math.PI / 180)
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLng / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}
