import React, { useState, useEffect } from 'react'
import './Map.css'
import {
    GoogleMap,
    Marker,
    InfoWindow,
    Polyline,
    useLoadScript,
} from '@react-google-maps/api'

const containerStyle = {
    width: '100%',
    height: '500px',
}

const center = {
    lat: 40.768,
    lng: -73.964,
}

// Dog and Cat breed options
const dogBreeds = [
    'Labrador Retriever',
    'German Shepherd',
    'Golden Retriever',
    'Bulldog',
    'Beagle',
    'Poodle',
    'Rottweiler',
    'Yorkshire Terrier',
    'Dachshund',
    'Boxer',
]
const catBreeds = [
    'Persian',
    'Maine Coon',
    'Siamese',
    'Ragdoll',
    'Bengal',
    'Sphynx',
    'British Shorthair',
]

// Function to create a circular icon, with fallback color if the image fails to load
const createCircularIcon = (imageUrl, fallbackColor, callback) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl

    img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 50
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')

        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.clip()

        ctx.drawImage(img, 0, 0, size, size)

        callback(canvas.toDataURL())
    }

    img.onerror = () => {
        const canvas = document.createElement('canvas')
        const size = 50
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')

        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.fillStyle = fallbackColor
        ctx.fill()

        callback(canvas.toDataURL())
    }
}

const Map = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    })

    const [reports, setReports] = useState([])
    const [stories, setStories] = useState([]) // State to store stories
    const [loading, setLoading] = useState(true)
    const [selectedReport, setSelectedReport] = useState(null)
    const [iconUrls, setIconUrls] = useState({})
    const [paths, setPaths] = useState([]) // State to store paths
    const [filters, setFilters] = useState({
        gender: '',
        species: '',
        reportType: '',
        fixed: '',
        collar: '',
        breed: '',
    })
    const [radius, setRadius] = useState(50)
    const polylineInstances = React.useRef([])
    const mapRef = React.useRef(null)

    const fetchReports = async () => {
        try {
            const queryParams = new URLSearchParams(filters)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report?${queryParams}`
            )
            const data = await response.json()
            setReports(data.reports)
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch reports', error)
            setLoading(false)
        }
    }

    const fetchStories = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/story`
            )
            const data = await response.json()
            setStories(data) // Use the story data directly
        } catch (error) {
            console.error('Failed to fetch stories', error)
        }
    }

    useEffect(() => {
        fetchReports()
        fetchStories()
    }, [filters])

    useEffect(() => {
        // Clean up old polylines
        polylineInstances.current.forEach((polyline) => {
            if (polyline) polyline.setMap(null)
        })
        polylineInstances.current = []
    }, [paths])

    useEffect(() => {
        reports.forEach((report) => {
            if (
                report.animal &&
                report.animal.imageUrl &&
                !iconUrls[report._id]
            ) {
                const fallbackColor =
                    report.reportType === 'Stray' ? '#00ff00' : '#ff0000'
                createCircularIcon(
                    report.animal.imageUrl,
                    fallbackColor,
                    (iconUrl) => {
                        setIconUrls((prev) => ({
                            ...prev,
                            [report._id]: iconUrl,
                        }))
                    }
                )
            }
        })
    }, [reports, iconUrls])

    const handleReportClick = (report) => {
        setSelectedReport(report)

        const story = stories.find((story) =>
            story.animalReports.some((r) => r._id === report._id)
        )

        if (story) {
            const sortedReports = story.animalReports.sort(
                (a, b) => new Date(a.dateReported) - new Date(b.dateReported)
            )

            const pathCoordinates = sortedReports.map((r) => {
                const [lng, lat] = r.location.coordinates.coordinates
                return { lat, lng }
            })

            setPaths([{ storyId: story._id, path: pathCoordinates }])
        } else {
            setPaths([])
        }

        // Center map on the selected report
        if (mapRef.current) {
            const [lng, lat] = report.location.coordinates.coordinates
            mapRef.current.panTo({ lat, lng })
            mapRef.current.setZoom(14)
        }
    }

    const handleReportHover = (report) => {
        if (report) {
            const story = stories.find((story) =>
                story.animalReports.some((r) => r._id === report._id)
            )

            if (story) {
                const sortedReports = story.animalReports.sort(
                    (a, b) =>
                        new Date(a.dateReported) - new Date(b.dateReported)
                )

                const pathCoordinates = sortedReports.map((r) => {
                    const [lng, lat] = r.location.coordinates.coordinates
                    return { lat, lng }
                })

                setPaths([{ storyId: story._id, path: pathCoordinates }])
            }
        } else {
            setPaths([]) // Clear paths when hover ends
        }
    }


    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters((prev) => ({ ...prev, [name]: value }))
    }

    const breedOptions =
        filters.species === 'Dog'
            ? dogBreeds
            : filters.species === 'Cat'
            ? catBreeds
            : []

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 3961
        const dLat = (lat2 - lat1) * (Math.PI / 180)
        const dLng = (lng2 - lng1) * (Math.PI / 180)
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
                Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }

    const filteredReports = reports.filter((report) => {
        const { location } = report
        if (location && location.coordinates) {
            const [lng, lat] = location.coordinates.coordinates
            const distance = calculateDistance(center.lat, center.lng, lat, lng)
            return distance <= radius
        }
        return false
    })

    if (!isLoaded) return <p>Google Maps failed to load. Check your API key.</p>
    if (loading) return <p>Loading map data...</p>

    return (
        <>
            <div className="filter-container">
                <h3>Filter Reports</h3>
                <select
                    name="gender"
                    className="filter-dropdown"
                    value={filters.gender}
                    onChange={handleFilterChange}
                >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <select
                    name="species"
                    className="filter-dropdown"
                    value={filters.species}
                    onChange={handleFilterChange}
                >
                    <option value="">All Species</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                </select>
                {filters.species && (
                    <select
                        name="breed"
                        className="filter-dropdown"
                        value={filters.breed}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Breeds</option>
                        {breedOptions.map((breed) => (
                            <option key={breed} value={breed}>
                                {breed}
                            </option>
                        ))}
                    </select>
                )}
                <select
                    name="reportType"
                    className="filter-dropdown"
                    value={filters.reportType}
                    onChange={handleFilterChange}
                >
                    <option value="">All Reports</option>
                    <option value="Stray">Stray</option>
                    <option value="Lost">Lost</option>
                </select>
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                />
                <p>{radius} miles radius</p>
            </div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
                onLoad={(map) => (mapRef.current = map)}
            >
                {filteredReports.map((report) => {
                    const { location } = report
                    if (
                        location &&
                        location.coordinates &&
                        Array.isArray(location.coordinates.coordinates) &&
                        location.coordinates.coordinates.length === 2
                    ) {
                        const [lng, lat] = location.coordinates.coordinates
                        const iconUrl = iconUrls[report._id]
                        const iconConfig = iconUrl
                            ? {
                                  url: iconUrl,
                                  scaledSize: new window.google.maps.Size(
                                      50,
                                      50
                                  ),
                              }
                            : undefined
                        return (
                            <Marker
                                key={report._id}
                                position={{ lat, lng }}
                                icon={iconConfig}
                                onMouseOver={() => handleReportHover(report)} // Spawn path
                                onMouseOut={() => handleReportHover(null)} // Remove path
                                onClick={() => handleReportClick(report)} // Click logic remains
                            />
                        )
                    }
                    return null
                })}
                {selectedReport && (
                    <InfoWindow
                        position={{
                            lat: selectedReport.location.coordinates
                                .coordinates[1],
                            lng: selectedReport.location.coordinates
                                .coordinates[0],
                        }}
                        onCloseClick={() => setSelectedReport(null)}
                    >
                        <div className="info-window">
                            <h3>
                                {selectedReport.animal.name} (
                                {selectedReport.animal.species})
                            </h3>
                            <img
                                src={selectedReport.animal.imageUrl}
                                alt={selectedReport.animal.name}
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '50%',
                                }}
                            />
                            <p>Breed: {selectedReport.animal.breed}</p>
                            <p>Color: {selectedReport.animal.color}</p>
                            <p>Gender: {selectedReport.animal.gender}</p>
                            <p>Report Type: {selectedReport.reportType}</p>
                            <p>Fixed Status: {selectedReport.animal.fixed}</p>
                            <p>
                                Collar:{' '}
                                {selectedReport.animal.collar ? 'Yes' : 'No'}
                            </p>
                            <p>
                                Date Reported:{' '}
                                {new Date(
                                    selectedReport.dateReported
                                ).toLocaleDateString()}
                            </p>
                            <p>
                                Address:{' '}
                                {selectedReport.location.address ||
                                    'Not provided'}
                            </p>
                        </div>
                    </InfoWindow>
                )}
                {paths.map((path) => (
                    <Polyline
                        key={path.storyId}
                        path={path.path}
                        options={{
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 4,
                        }}
                    />
                ))}
            </GoogleMap>
        </>
    )
}

export default Map
