"use client";
import Link from 'next/link'
import { GoogleMap, Marker, LoadScriptNext } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const ReadMoreById = ({ id }) => {
    const [stray, setStray] = useState([]); // State for storing stray data
    const [loading, setLoading] = useState(true); // State for loading 
    const [mapCenter, setMapCenter] = useState({ lat: 51.505, lng: -0.09 }); // Default coordinates for the map

    useEffect(() => {
        const fetchStrayData = async () =>{
            try{
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/spottedstray/${id}`);
                const data = await response.json();

                setStray(data); // stores data in the state
                // Set map center based on coordinates from JSON
                if (data.animal && data.animal.coordinates) {
                    setMapCenter({
                        lat: data.animal.coordinates.coordinates[1], // latitude comes second in GeoJSON
                        lng: data.animal.coordinates.coordinates[0]  // longitude comes first
                    });
                }
            } catch(error) {
                console.error('Error fetching stray data: ', error);
            } finally {
                setLoading(false); // stop loading when the fetching of data is complete
            }
        };
        if(id) {
            fetchStrayData();
        }
    },[]);

    if (loading){
        return (
            <div> Loading....</div>
        )
    }
    return (
        <div className="col">
            <div className="card m-3 p-0">
                <h1 className="card-title">{stray.animal.name}</h1>
                <div className="mx-3 border p-2" >
                    <img src={stray.animal.imageUrl} className="card-img-top" alt={stray.animal.name} />
                </div>
                <div className="card-body">
                    <p className="card-text">{stray.animal.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Species: {stray.animal.species}</li>
                    <li className="list-group-item">Breed: {stray.animal.breed}</li>
                    <li className="list-group-item">Gender: {stray.animal.gender}</li>
                    <li className="list-group-item">State: {stray.animal.state}</li>
                    <li className="list-group-item">Date Reported: {new Date(stray.animal.dateReported).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}, {new Date(stray.animal.dateReported).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric'
                    })}</li>
                    <li className="list-group-item">Coordinates:<br/>
                    Latitude: {stray.animal.coordinates.coordinates[1]}<br/>
                    Longitude: {stray.animal.coordinates.coordinates[0]}</li>

                </ul>
                <div className = "mx-3 mt-2">
                    {/* Render Google Map */}
                    <LoadScriptNext googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                        <GoogleMap
                            mapContainerStyle={{
                                height: '1000px',
                                width: '100%',
                            }}
                            center={mapCenter}
                            zoom={17}
                        >
                            {/* Marker based on stray's coordinates */}
                            <Marker position={mapCenter} 
                            // icon={{
                            //     url: `${stray.animal.image}`, // URL to your custom marker image
                            //     scaledSize: new window.google.maps.Size(40, 40) // Custom size (optional)
                            // }}
                            />
                        </GoogleMap>
                    </LoadScriptNext>
                </div>
                <div className="d-flex mb-2 mt-3">
                    <Link href="/" className="btn btn-secondary ms-auto">
                        Go Back
                    </Link>
                </div>
            </div>
        </div>
    );  
};

export default ReadMoreById;