import React, { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useRouter } from 'next/navigation' // Updated import for Next.js 13+

const ReportLost = () => {
    const router = useRouter() // Initialize router for navigation
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        color: '',
        gender: 'Unknown',
        description: '',
        location: '',
        imageUrl: '',
        coordinates: { lat: 51.505, lng: -0.09 }, // Default coordinates
    })

    const [isOtherBreed, setIsOtherBreed] = useState(false) // Manage 'Other' breed input
    const [commonBreeds, setCommonBreeds] = useState([]) // Manage breed options based on species
    const [userLocation, setUserLocation] = useState(null) // User's current location
    const [locationAsked, setLocationAsked] = useState(false) // Track if location has been asked
    const [loading, setLoading] = useState(false) // Loading state for form submission
    const [error, setError] = useState('') // Error state for submission

    const speciesOptions = [
        {
            value: 'Dog',
            label: 'Dog',
            breeds: [
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
                "I don't know",
                'Other',
            ],
        },
        {
            value: 'Cat',
            label: 'Cat',
            breeds: [
                'Persian',
                'Maine Coon',
                'Siamese',
                'Ragdoll',
                'Bengal',
                'Sphynx',
                'British Shorthair',
                "I don't know",
                'Other',
            ],
        },
        { value: 'Other', label: "I don't know", breeds: [] }, // No specific breeds
    ]

    useEffect(() => {
        // Ask for location once when the component mounts
        if (navigator.geolocation && !locationAsked) {
            const askForLocation = window.confirm(
                'Would you like to share your location?'
            )
            if (askForLocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords
                        setUserLocation({ lat: latitude, lng: longitude })
                        setFormData((prevData) => ({
                            ...prevData,
                            coordinates: { lat: latitude, lng: longitude },
                            location: `Lat: ${latitude}, Lng: ${longitude}`,
                        }))
                    },
                    (error) => {
                        console.error('Error getting location: ', error)
                        alert(
                            'Unable to retrieve your location. Please enter it manually.'
                        )
                    }
                )
            }
            setLocationAsked(true) // Mark that the user has been asked
        }
    }, []) // Run the effect only on component mount

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))

        // If the species changes, update the breeds
        if (name === 'species') {
            const selectedSpecies = speciesOptions.find(
                (species) => species.value === value
            )
            setCommonBreeds(selectedSpecies ? selectedSpecies.breeds : [])
            setFormData((prevData) => ({
                ...prevData,
                breed: '',
            }))
        }

        // If the breed is selected as "Other", set the state to show the additional input
        if (name === 'breed' && value === 'Other') {
            setIsOtherBreed(true)
        } else {
            setIsOtherBreed(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true) // Start loading state
        setError('') // Reset error state

        // Format the coordinates as GeoJSON
        const formattedData = {
            ...formData,
            coordinates: {
                type: 'Point',
                coordinates: [
                    formData.coordinates.lng,
                    formData.coordinates.lat,
                ], // [lng, lat] for GeoJSON
            },
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/lostpet`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formattedData), // Send the formatted data
                }
            )

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`)
            }

            const result = await response.json()
            console.log('Form submitted successfully:', result)
            router.push('/') // Navigate back to the home page after submission
        } catch (error) {
            setError(error.message) // Set error message
            console.error('Error submitting form:', error.message)
        } finally {
            setLoading(false) // End loading state
        }
    }

    const handleMapClick = (event) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        setFormData((prevData) => ({
            ...prevData,
            coordinates: { lat, lng },
            location: `Lat: ${lat}, Lng: ${lng}`, // Update location input
        }))
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="border border-purple rounded p-4">
                        <h2 className="text-center">Report a Lost Pet</h2>
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}{' '}
                        {/* Display error message */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="species" className="form-label">
                                    Species
                                </label>
                                <select
                                    className="form-select"
                                    id="species"
                                    name="species"
                                    value={formData.species}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select species</option>
                                    {speciesOptions.map((species) => (
                                        <option
                                            key={species.value}
                                            value={species.value}
                                        >
                                            {species.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="breed" className="form-label">
                                    Breed
                                </label>
                                <select
                                    className="form-select"
                                    id="breed"
                                    name="breed"
                                    value={formData.breed}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select breed</option>
                                    {commonBreeds.map((breed) => (
                                        <option key={breed} value={breed}>
                                            {breed}
                                        </option>
                                    ))}
                                </select>
                                {isOtherBreed && (
                                    <input
                                        type="text"
                                        className="form-control mt-2"
                                        placeholder="Please specify"
                                        value={
                                            formData.breed === 'Other'
                                                ? ''
                                                : formData.breed
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                breed: e.target.value,
                                            })
                                        }
                                    />
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="color" className="form-label">
                                    Color
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="gender" className="form-label">
                                    Gender
                                </label>
                                <select
                                    className="form-select"
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="Unknown">Unknown</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label
                                    htmlFor="description"
                                    className="form-label"
                                >
                                    Description
                                </label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                {/* Google Map Component */}
                                <LoadScript googleMapsApiKey={apiKey}>
                                    <GoogleMap
                                        onClick={handleMapClick}
                                        mapContainerStyle={{
                                            height: '400px',
                                            width: '100%',
                                        }}
                                        center={
                                            userLocation || formData.coordinates
                                        } // Center the map on user's location if available
                                        zoom={13}
                                    >
                                        <Marker
                                            position={formData.coordinates}
                                        />
                                        {userLocation && (
                                            <Marker
                                                position={userLocation}
                                                icon={{
                                                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Custom icon for user location
                                                    scaledSize:
                                                        new window.google.maps.Size(
                                                            30,
                                                            30
                                                        ), // Size of the icon
                                                }}
                                            />
                                        )}
                                    </GoogleMap>
                                </LoadScript>
                            </div>

                            <div className="mb-3">
                                <label
                                    htmlFor="imageUrl"
                                    className="form-label"
                                >
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    className="form-control"
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportLost
