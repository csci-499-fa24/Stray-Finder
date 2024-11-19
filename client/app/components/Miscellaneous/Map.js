<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import "./Map.css";
import {
    GoogleMap,
    Marker,
    InfoWindow,
    Circle,
    useLoadScript,
} from '@react-google-maps/api';
=======
import React, { useState, useEffect } from 'react'
import './Map.css'
import {
    GoogleMap,
    Marker,
    InfoWindow,
    Polyline,
    useLoadScript,
} from '@react-google-maps/api'
>>>>>>> 0048be6e28575dee590553fc50d714a618da58d4


const containerStyle = {
<<<<<<< HEAD
   width: '100%',
   height: '500px',
};
=======
    width: '100%',
    height: '500px',
}
>>>>>>> 0048be6e28575dee590553fc50d714a618da58d4


const center = {
<<<<<<< HEAD
   lat: 40.768,
   lng: -73.964,
};
=======
    lat: 40.768,
    lng: -73.964,
}
>>>>>>> 0048be6e28575dee590553fc50d714a618da58d4


// Dog and Cat breed options
const dogBreeds = [
<<<<<<< HEAD
   "Labrador Retriever", "German Shepherd", "Golden Retriever", "Bulldog",
   "Beagle", "Poodle", "Rottweiler", "Yorkshire Terrier", "Dachshund", "Boxer"
];
const catBreeds = [
   "Persian", "Maine Coon", "Siamese", "Ragdoll", "Bengal",
   "Sphynx", "British Shorthair"
];

=======
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
>>>>>>> 0048be6e28575dee590553fc50d714a618da58d4



// Function to create a circular icon, with fallback color if the image fails to load
const createCircularIcon = (imageUrl, fallbackColor, callback) => {
<<<<<<< HEAD
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

const calculateBounds = (center, radiusInMiles) => {
    const radiusInMeters = radiusInMiles * 1609.34; // Convert miles to meters
    const latDelta = (radiusInMeters / 6378137) * (180 / Math.PI); // Approximate latitude delta
    const lngDelta = latDelta / Math.cos(center.lat * (Math.PI / 180)); // Adjust longitude delta for latitude
    return {
        north: center.lat + latDelta,
        south: center.lat - latDelta,
        east: center.lng + lngDelta,
        west: center.lng - lngDelta,
    };
};
=======
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
>>>>>>> 0048be6e28575dee590553fc50d714a618da58d4


const Map = () => {
<<<<<<< HEAD
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
        reportType: '',
        fixed: '',
        collar: '',
        breed: ''
    });
    const [radius, setRadius] = useState(50); // Add radius state (in miles)

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


   const breedOptions = filters.species === 'Dog' ? dogBreeds : filters.species === 'Cat' ? catBreeds : [];


   // Function to calculate distance between two points (Haversine formula)
   const calculateDistance = (lat1, lng1, lat2, lng2) => {
       const R = 3961; // Radius of the Earth in miles
       const dLat = (lat2 - lat1) * (Math.PI / 180);
       const dLng = (lng2 - lng1) * (Math.PI / 180);
       const a =
           Math.sin(dLat / 2) * Math.sin(dLat / 2) +
           Math.cos(lat1 * (Math.PI / 180)) *
               Math.cos(lat2 * (Math.PI / 180)) *
               Math.sin(dLng / 2) *
               Math.sin(dLng / 2);
       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
       return R * c; // Distance in miles
   };


    // Filter reports based on the distance from the center point
    const filteredReports = reports.filter((report) => {
        const { location } = report;
        if (location && location.coordinates) {
            const [lng, lat] = location.coordinates.coordinates;
            const distance = calculateDistance(center.lat, center.lng, lat, lng);
            return distance <= radius; // Check if the report is within the radius
        }
        return false;
    });

   // Show a loading message until the reports are fetched
   if (!isLoaded || loading) return <div className="spinner-border text-primary" role="status">
   <span className="sr-only"></span>
   </div>;


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
                   <select name="breed" className="filter-dropdown" value={filters.breed} onChange={handleFilterChange}>
                       <option value="">All Breeds</option>
                       {breedOptions.map((breed) => (
                           <option key={breed} value={breed}>{breed}</option>
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

               <select
                   name="fixed"
                   className="filter-dropdown"
                   value={filters.fixed}
                   onChange={handleFilterChange}
               >
                   <option value="">Fixed Status</option>
                   <option value="Yes">Fixed</option>
                   <option value="No">Not Fixed</option>
               </select>


               <select
                   name="collar"
                   className="filter-dropdown"
                   value={filters.collar}
                   onChange={handleFilterChange}
               >
                   <option value="">Collar Status</option>
                   <option value="true">With Collar</option>
                   <option value="false">Without Collar</option>
               </select>


              


                {/* Slider to adjust the radius */}
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                />
                <p>{radius} miles radius</p>
            </div>

            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
                {Array.isArray(filteredReports) && filteredReports.length > 0 ? (
                    filteredReports.map((report) => {
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
                    <p>No reports available within the selected radius</p>
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
                            <p>Fixed Status: {selectedReport.animal.fixed}</p>
                            <p>Collar: {selectedReport.animal.collar ? "Yes" : "No"}</p>
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
