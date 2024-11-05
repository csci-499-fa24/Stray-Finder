import "./Map.css"
import React, { useState, useEffect } from 'react';
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

const Map = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [filters, setFilters] = useState({
        gender: '',
        species: '',
        reportType: ''
    });

    // Function to fetch reports with selected filters
    const fetchReports = async () => {
        try {
            // Construct query string based on selected filters
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

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    if (!isLoaded || loading) return <div>Loading reports and map...</div>;

    return (
        <>
            {/* Filter Form */}
            <div>
                <h3>Filter Reports</h3>
                
                <select name="gender" value={filters.gender} onChange={handleFilterChange}>
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <select name="species" value={filters.species} onChange={handleFilterChange}>
                    <option value="">All Species</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    {/* Add more species options as needed */}
                </select>

                <select name="reportType" value={filters.reportType} onChange={handleFilterChange}>
                    <option value="">All Reports</option>
                    <option value="Stray">Stray</option>
                    <option value="Lost">Lost</option>
                </select>
                
            </div>

            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
                {reports.map((report) => {
                    const { location } = report;

                    if (location && location.coordinates && Array.isArray(location.coordinates.coordinates)) {
                        const [lng, lat] = location.coordinates.coordinates;

                        return (
                            <Marker
                                key={report._id}
                                position={{
                                    lat: lat,
                                    lng: lng,
                                }}
                                onClick={() => setSelectedReport(report)}
                            />
                        );
                    }
                    return null;
                })}

                {selectedReport && (
                    <InfoWindow
                        position={{
                            lat: selectedReport.location.coordinates.coordinates[1],
                            lng: selectedReport.location.coordinates.coordinates[0],
                        }}
                        onCloseClick={() => setSelectedReport(null)}
                    >
                        <div>
                            <h3>{selectedReport.animal.name} ({selectedReport.animal.species})</h3>
                            <img src={selectedReport.animal.imageUrl} alt={selectedReport.animal.name} style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
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