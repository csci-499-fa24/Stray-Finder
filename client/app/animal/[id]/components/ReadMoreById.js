'use client'
import Link from 'next/link'
import { GoogleMap, Marker, LoadScriptNext } from '@react-google-maps/api'
import { useEffect, useState } from 'react'

const ReadMoreById = ({ id }) => {
    const [animal, setAnimal] = useState(null) // State for storing single animal data
    const [loading, setLoading] = useState(true) // State for loading
    const [mapCenter, setMapCenter] = useState({ lat: 51.505, lng: -0.09 }) // Default coordinates for the map

    useEffect(() => {
        const fetchAnimalData = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal/${id}`
                )
                const data = await response.json()

                setAnimal(data.animal) // stores data in the state

                // Set map center based on coordinates from JSON if available
                if (data.animal && data.animal.coordinates) {
                    setMapCenter({
                        lat: data.animal.coordinates[1], // latitude comes second in GeoJSON
                        lng: data.animal.coordinates[0], // longitude comes first
                    })
                }
            } catch (error) {
                console.error('Error fetching animal data: ', error)
            } finally {
                setLoading(false) // stop loading when the fetching of data is complete
            }
        }
        if (id) {
            fetchAnimalData()
        }
    }, [id])

    if (loading) {
        return <div>Loading....</div>
    }

    return (
        <div className="col p-5">
            <div className="card m-3 p-0">
                <h1 className="card-title text-center p-3 main-prp">
                    {animal?.name}
                </h1>
                <div className="mx-5 p-2">
                    <img
                        src={animal?.imageUrl}
                        className="card-img-top"
                        alt={animal?.name}
                    />
                </div>
                <div className="card-body">
                    <p className="card-text">{animal?.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        Species: {animal?.species}
                    </li>
                    <li className="list-group-item">
                        Breed: {animal?.breed || 'Unknown'}
                    </li>
                    <li className="list-group-item">
                        Color: {animal?.color || 'Unknown'}
                    </li>
                    <li className="list-group-item">
                        Gender: {animal?.gender}
                    </li>
                    <li className="list-group-item">Fixed: {animal?.fixed}</li>
                    <li className="list-group-item">
                        Collar: {animal?.collar ? 'Yes' : 'No'}
                    </li>
                </ul>
                {animal?.coordinates && (
                    <div className="mx-3 mt-2">
                        {/* Render Google Map */}
                        <LoadScriptNext
                            googleMapsApiKey={
                                process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                            }
                        >
                            <GoogleMap
                                mapContainerStyle={{
                                    height: '500px',
                                    width: '100%',
                                }}
                                center={mapCenter}
                                zoom={17}
                            >
                                {/* Marker based on animal's coordinates */}
                                <Marker position={mapCenter} />
                            </GoogleMap>
                        </LoadScriptNext>
                    </div>
                )}
                <div className="d-flex mb-2 mt-3">
                    <Link href="/" className="btn btn-secondary ms-auto">
                        Go Back
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ReadMoreById