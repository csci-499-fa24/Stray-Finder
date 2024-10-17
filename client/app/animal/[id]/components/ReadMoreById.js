"use client";
import Link from 'next/link'
import { GoogleMap, Marker, LoadScriptNext } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const ReadMoreById = ({ id }) => {
    const [animals, setAnimals] = useState([]); // State for storing animals data
    const [loading, setLoading] = useState(true); // State for loading 
    const [mapCenter, setMapCenter] = useState({ lat: 51.505, lng: -0.09 }); // Default coordinates for the map

    useEffect(() => {
        const fetchStrayData = async () =>{
            try{
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal/${id}`);
                const data = await response.json();

                setAnimals(data); // stores data in the state
                // Set map center based on coordinates from JSON
                if (data.animal && data.animal.coordinates) {
                    setMapCenter({
                        lat: data.animal.coordinates.coordinates[1], // latitude comes second in GeoJSON
                        lng: data.animal.coordinates.coordinates[0]  // longitude comes first
                    });
                }
            } catch(error) {
                console.error('Error fetching animals data: ', error);
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
                <h1 className="card-title">{animals.animal.name}</h1>
                <div className="mx-3 border p-2" >
                    <img src={animals.animal.imageUrl} className="card-img-top" alt={animals.animal.name} />
                </div>
                <div className="card-body">
                    <p className="card-text">{animals.animal.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Species: {animals.animal.species}</li>
                    <li className="list-group-item">Breed: {animals.animal.breed}</li>
                    <li className="list-group-item">Gender: {animals.animal.gender}</li>
                    <li className="list-group-item">State: {animals.animal.state}</li>
                    <li className="list-group-item">Date Reported: {new Date(animals.animal.dateReported).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}, {new Date(animals.animal.dateReported).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric'
                    })}</li>
                    <li className="list-group-item">Coordinates:<br/>
                    Latitude: {animals.animal.coordinates.coordinates[1]}<br/>
                    Longitude: {animals.animal.coordinates.coordinates[0]}</li>

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
                            {/* Marker based on animals's coordinates */}
                            <Marker position={mapCenter} 
                            // icon={{
                            //     url: `${animals.animal.image}`, // URL to your custom marker image
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