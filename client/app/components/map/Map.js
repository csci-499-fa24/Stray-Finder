import React, { useState, useEffect, useRef, useMemo } from 'react'
import './Map.css'
import {
    GoogleMap,
    useLoadScript,
    Polyline,
    Marker,
} from '@react-google-maps/api'
import Filters from './Filters'
import Markers from './Markers'
import InfoWindowDetails from './InfoWindowDetails'
import CircleOverlay from './CircleOverlay'
import { calculateBounds, calculateDistance } from './utils'
import { createCircularIcon } from './CircularIcon'
import 'bootstrap/dist/css/bootstrap.min.css'
import Loader from '../loader/Loader';

const containerStyle = {
    width: '100%',
    height: '500px',
}

const center = {
    lat: 40.768,
    lng: -73.964,
}

const Map = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    })

    const mapRef = useRef(null)
    const polylineRef = useRef(null) // Reference to manage the polyline
    const [reports, setReports] = useState([])
    const [stories, setStories] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedReport, setSelectedReport] = useState(null)
    const [iconUrls, setIconUrls] = useState({})
    const [filters, setFilters] = useState({
        gender: '',
        species: '',
        reportType: '',
        fixed: '',
        collar: '',
        breed: '',
    })
    const [radius, setRadius] = useState(10)
    const [userLocation, setUserLocation] = useState(null)
    const [isInitialized, setIsInitialized] = useState(false)
    const [activeStory, setActiveStory] = useState(null)
    const [zoomLevel, setZoomLevel] = useState(13)

    useEffect(() => {
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

        fetchReports()
    }, [filters])

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/story`
                )
                const data = await response.json()
                setStories(data)
            } catch (error) {
                console.error('Failed to fetch stories', error)
            }
        }

        fetchStories()
    }, [])

    useEffect(() => {
        if (reports.length > 0) {
            reports.forEach((report) => {
                const fallbackColor =
                    report.reportType === 'Stray'
                        ? '#FFA500'
                        : report.reportType === 'Lost'
                        ? '#FF0000'
                        : report.reportType === 'Found'
                        ? '#00FF00'
                        : '#000000'

                createCircularIcon(
                    report.animal.imageUrl,
                    fallbackColor,
                    (iconUrl) => {
                        if (iconUrl) {
                            setIconUrls((prev) => ({
                                ...prev,
                                [report._id]: iconUrl,
                            }))
                        }
                    }
                )
            })
        }
    }, [reports])
    

    useEffect(() => {
        if (!isInitialized) {
            const requestLocationPermission = () => {
                const confirmPermission = window.confirm(
                    'This site would like to use your location. Would you like to allow it?'
                );
                if (confirmPermission) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            setUserLocation({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            });
                            setRadius(10);
                            setIsInitialized(true);
                        },
                        (error) => {
                            console.error('Geolocation error:', error);
                            alert('Unable to fetch your location. Defaulting to default location.');
                            setUserLocation(center);
                            setRadius(10);
                            setIsInitialized(true);
                        }
                    );
                } else {
                    alert('Location access denied. Using default location.');
                    setUserLocation(center);
                    setRadius(10);
                    setIsInitialized(true);
                }
            };
    
            if (navigator.geolocation) {
                requestLocationPermission();
            } else {
                alert('Geolocation is not supported by your browser. Using default location.');
                setUserLocation(center);
                setRadius(10);
                setIsInitialized(true);
            }
        }
    }, [isInitialized]);
    
    

    const handleMapLoad = (map) => {
        mapRef.current = map
    }

    const handleZoomChanged = () => {
        if (mapRef.current) {
            setZoomLevel(mapRef.current.getZoom())
        }
    }

    useEffect(() => {
        if (mapRef.current && userLocation && radius) {
            const bounds = calculateBounds(userLocation, radius)
            mapRef.current.fitBounds(bounds)
        }
    }, [userLocation, radius])

    const filteredReports = useMemo(() => {
        return reports.filter((report) => {
            const { location } = report
            const baseLocation = userLocation || center
            if (location && location.coordinates) {
                const [lng, lat] = location.coordinates.coordinates
                const distance = calculateDistance(
                    baseLocation.lat,
                    baseLocation.lng,
                    lat,
                    lng
                )
                return distance <= radius
            }
            return false
        })
    }, [reports, userLocation, radius])

    const storyPath = useMemo(() => {
        if (!activeStory) return []

        const relatedStory = stories.find((story) =>
            story.animalReports.some((report) => report._id === activeStory)
        )

        if (!relatedStory) return []

        const sortedReports = relatedStory.animalReports.sort((a, b) =>
            new Date(a.dateReported) > new Date(b.dateReported) ? 1 : -1
        )

        return sortedReports.map((report) => ({
            lat: report.location.coordinates.coordinates[1],
            lng: report.location.coordinates.coordinates[0],
        }))
    }, [stories, activeStory])

    // Effect to manage the polyline lifecycle
    useEffect(() => {
        if (polylineRef.current) {
            // If a polyline already exists, remove it
            polylineRef.current.setMap(null)
            polylineRef.current = null
        }

        if (activeStory && storyPath.length > 1 && radius >= 5) {
            // If there is an active story and it has a valid path, create a new polyline
            const newPolyline = new window.google.maps.Polyline({
                path: storyPath,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
            })

            newPolyline.setMap(mapRef.current)
            polylineRef.current = newPolyline
        }
    }, [activeStory, storyPath, radius])

    if (!isLoaded || loading) {
        return <Loader />
    }

    return (
        <>
            <Filters
                filters={filters}
                setFilters={setFilters}
                setRadius={setRadius}
                radius={radius}
            />
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={userLocation || center}
                zoom={zoomLevel}
                onLoad={handleMapLoad}
                onZoomChanged={handleZoomChanged}
            >
                <CircleOverlay
                    center={userLocation || center}
                    radius={radius}
                />
                <Markers
                    reports={filteredReports}
                    iconUrls={iconUrls}
                    setSelectedReport={setSelectedReport}
                />
                {filteredReports.map((report) =>
                    stories.some((story) =>
                        story.animalReports.some(
                            (animalReport) => animalReport._id === report._id
                        )
                    ) ? (
                        <Marker
                            key={`button-marker-${report._id}`}
                            position={{
                                lat: report.location.coordinates.coordinates[1],
                                lng: report.location.coordinates.coordinates[0],
                            }}
                            icon={{
                                path: google.maps.SymbolPath.CIRCLE,
                                fillColor: 'blue',
                                fillOpacity: 1,
                                strokeWeight: 0,
                                scale: 6,
                            }}
                            onClick={() =>
                                activeStory === report._id
                                    ? setActiveStory(null)
                                    : setActiveStory(report._id)
                            }
                        />
                    ) : null
                )}
                {selectedReport && (
                    <InfoWindowDetails
                        selectedReport={selectedReport}
                        setSelectedReport={setSelectedReport}
                    />
                )}
            </GoogleMap>
        </>
    )
}

export default Map
