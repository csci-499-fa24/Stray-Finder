import React, { useState, useEffect } from 'react';
import "./Map.css"
import {
    GoogleMap,
    Marker,
    InfoWindow,
    useLoadScript,
} from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '500px',
};

const center = {
    lat: 40.768,
    lng: -73.964,
};

// Function to create a circular icon, with fallback color if the image fails to load
const createCircularIcon = (imageUrl, fallbackColor, callback) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 50; 
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Create a circular clip for the icon
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        // Draw the image within the circular region
        ctx.drawImage(img, 0, 0, size, size);

        callback(canvas.toDataURL());
    };

    img.onerror = () => {
        // Draw a colored circle as a fallback if the image fails to load
        const canvas = document.createElement('canvas');
        const size = 50;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = fallbackColor;
        ctx.fill();

        callback(canvas.toDataURL());
    };
};

const Map = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [iconUrls, setIconUrls] = useState({});
    const [filters, setFilters] = useState({
        gender: '',
        species: '',
        reportType: ''
    });

    const fetchReports = async () => {
        try {
            const queryParams = new URLSearchParams(filters);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report?${queryParams}`
            );
            const data = await response.json();
            setReports(data.reports);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch reports', error);
            setLoading(false);
        }
    };

    // Fetch reports on initial load and when filters change
    useEffect(() => {
        fetchReports();
    }, [filters]);

    // Loop through reports and create icons when reports are fetched
    useEffect(() => {
        if (reports.length > 0) {
            reports.forEach((report) => {
                // Define fallback color based on report type
                const fallbackColor = report.reportType === 'Stray' ? '#00ff00' : '#ff0000'; // Green for Stray, Red for Lost
                
                // Create the circular icon using the fallback color
                createCircularIcon(report.animal.imageUrl, fallbackColor, (iconUrl) => {
                    if (iconUrl) {
                        setIconUrls((prev) => ({
                            ...prev,
                            [report._id]: iconUrl,
                        }));
                    }
                });
            });
        }
    }, [reports]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    if (!isLoaded || loading) return <div>Loading reports and map...</div>;

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
            </div>

            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
                {Array.isArray(reports) && reports.length > 0 ? (
                    reports.map((report) => {
                        const { location } = report;

                        if (
                            location &&
                            location.coordinates &&
                            Array.isArray(location.coordinates.coordinates) &&
                            location.coordinates.coordinates.length === 2
                        ) {
                            const [lng, lat] = location.coordinates.coordinates;
                            const iconUrl = iconUrls[report._id];

                            const iconConfig = iconUrl
                                ? {
                                      url: iconUrl,
                                      scaledSize: new window.google.maps.Size(50, 50),
                                  }
                                : undefined;

                            return (
                                <Marker
                                    key={report._id}
                                    position={{ lat, lng }}
                                    icon={iconConfig}
                                    onClick={() => setSelectedReport(report)}
                                />
                            );
                        }
                        return null;
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
                        <div className="info-window">
                            <h3>{selectedReport.animal.name} ({selectedReport.animal.species})</h3>
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
                            <p>Date Reported: {new Date(selectedReport.dateReported).toLocaleDateString()}</p>
                            <p>Address: {selectedReport.location.address || 'Address not provided'}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </>
    );
};

export default Map;
