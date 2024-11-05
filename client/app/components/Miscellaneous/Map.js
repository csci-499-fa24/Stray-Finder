import React, { useState, useEffect } from 'react'
import {
    GoogleMap,
    Marker,
    InfoWindow,
    useLoadScript,
} from '@react-google-maps/api'

const containerStyle = {
    width: '100%',
    height: '500px',
}

const center = {
    lat: 40.768, // Default center location
    lng: -73.964,
}

// Helper function to create a circular icon with CORS handling
const createCircularIcon = (imageUrl, callback) => {
    const img = new Image()
    img.crossOrigin = 'anonymous' // Allow cross-origin images
    img.src = imageUrl

    img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 50
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')

        // Create a circle
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.clip()

        // Draw the image into the circular region
        ctx.drawImage(img, 0, 0, size, size)

        // Call the callback with the circular icon data URL
        callback(canvas.toDataURL())
    }

    img.onerror = (error) => {
        callback(null) // Return null if image loading fails
    }
}

const Map = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    })

    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedReport, setSelectedReport] = useState(null)
    const [iconUrls, setIconUrls] = useState({}) // State to store circular icons

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report`
                )
                const data = await response.json()

                // Filter the reports to include only those with reportType="Stray"
                const strayReports = data.reports.filter(
                    (report) => report.reportType === 'Stray'
                )

                setReports(strayReports)

                // Preload and create circular icons for each filtered report
                strayReports.forEach((report) => {
                    createCircularIcon(report.animal.imageUrl, (iconUrl) => {
                        if (iconUrl) {
                            setIconUrls((prev) => ({
                                ...prev,
                                [report._id]: iconUrl,
                            }))
                        }
                    })
                })

                setLoading(false) // Set loading to false after everything is done
            } catch (error) {
                console.error('Failed to fetch reports', error)
                setLoading(false)
            }
        }

        fetchReports()
    }, [])

    // Show a loading message until the reports are fetched
    if (!isLoaded || loading) return <div className="spinner-border text-primary" role="status">
    <span className="sr-only"></span>
    </div>

    return (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
            {Array.isArray(reports) && reports.length > 0 ? (
                reports.map((report) => {
                    const { location } = report

                    // Check if coordinates are available
                    if (
                        location &&
                        location.coordinates &&
                        Array.isArray(location.coordinates.coordinates) &&
                        location.coordinates.coordinates.length === 2
                    ) {
                        const [lng, lat] = location.coordinates.coordinates // Destructure the coordinates array
                        const iconUrl = iconUrls[report._id] // Get the preloaded circular icon URL

                        // Check if iconUrl is valid, and only use it if it's a valid string
                        const iconConfig = iconUrl
                            ? {
                                  url: iconUrl,
                                  scaledSize: new window.google.maps.Size(
                                      50,
                                      50
                                  ),
                              }
                            : undefined // Fallback to default marker if iconUrl is invalid

                        return (
                            <Marker
                                key={report._id}
                                position={{
                                    lat: lat,
                                    lng: lng,
                                }}
                                icon={iconConfig} // Only set icon if iconConfig is valid
                                onClick={() => {
                                    setSelectedReport(report)
                                }}
                            />
                        )
                    }
                    return null // Return null if the coordinates are not valid
                })
            ) : (
                <p>No stray reports available</p>
            )}

            {selectedReport && (
                <InfoWindow
                    position={{
                        lat: selectedReport.location.coordinates.coordinates[1],
                        lng: selectedReport.location.coordinates.coordinates[0],
                    }}
                    onCloseClick={() => setSelectedReport(null)}
                >
                    <div>
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
                        <p>
                            Date Reported:{' '}
                            {new Date(
                                selectedReport.dateReported
                            ).toLocaleDateString()}
                        </p>
                        <p>
                            Address:{' '}
                            {selectedReport.location.address ||
                                'Address not provided'}
                        </p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    )
}

export default Map