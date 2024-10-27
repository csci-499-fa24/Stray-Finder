import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api'
import { useRouter } from 'next/navigation'
import useAuth from '@/app/hooks/useAuth'

const ReportAnimal = () => {
    const router = useRouter()
    const { isAuthenticated, user } = useAuth() // Get user and authentication status from useAuth
    const [formData, setFormData] = useState({
        reportType: '',
        name: '',
        species: '',
        breed: '',
        color: '',
        gender: 'Unknown',
        fixed: 'Unknown',
        collar: false,
        description: '',
        location: '',
        coordinates: { lat: 40.768, lng: -73.964 }, // Default coordinates
    })

    const [file, setFile] = useState(null) // Store the image file
    const [isOtherBreed, setIsOtherBreed] = useState(false)
    const [commonBreeds, setCommonBreeds] = useState([])
    const [userLocation, setUserLocation] = useState(null)
    const [locationAsked, setLocationAsked] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

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
        { value: 'Other', label: "I don't know", breeds: [] },
    ]

    useEffect(() => {
        if (isAuthenticated === false) {
            router.push('/auth') // Redirect to login if not authenticated
        }

        if (isAuthenticated && navigator.geolocation && !locationAsked) {
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
                        console.error('Error getting location:', error)
                        alert(
                            'Unable to retrieve your location. Please enter it manually.'
                        )
                    }
                )
            }
            setLocationAsked(true)
        }
    }, [isAuthenticated, locationAsked, router])

    if (isAuthenticated === null) {
        return <div>Loading...</div> // Show loading while auth status is unknown
    }

    if (isAuthenticated === false) {
        return null // Return nothing if the user is not authenticated (will redirect)
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }))

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

        if (name === 'breed' && value === 'Other') {
            setIsOtherBreed(true)
        } else {
            setIsOtherBreed(false)
        }
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]) // Store the selected file
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Prepare FormData for the image and other form data
        const uploadData = new FormData()
        uploadData.append('reportType', formData.reportType)
        uploadData.append('name', formData.name)
        uploadData.append('species', formData.species)
        uploadData.append('breed', formData.breed)
        uploadData.append('color', formData.color)
        uploadData.append('gender', formData.gender)
        uploadData.append('fixed', formData.fixed)
        uploadData.append('collar', formData.collar)
        uploadData.append('description', formData.description)
        uploadData.append('reportedBy', user._id) // Add user ID

        // Create the location data in GeoJSON format
        const locationData = {
            address: formData.location || 'Unknown', // Default to 'Unknown' if no address is provided
            coordinates: {
                type: 'Point',
                coordinates: [
                    formData.coordinates.lng,
                    formData.coordinates.lat,
                ], // Coordinates in GeoJSON format: [longitude, latitude]
            },
        }

        // Append location as a stringified JSON object
        uploadData.append('location', JSON.stringify(locationData))

        // If an image file is selected, append it to the FormData
        if (file) {
            uploadData.append('image', file)
        }

        try {
            const requestOptions = {
                method: 'POST',
                body: uploadData, // Use FormData
                credentials: 'include',
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report`,
                requestOptions
            )

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`)
            }

            const result = await response.json()
            console.log('Form submitted successfully:', result)
            router.push('/')
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleMapClick = (event) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        setFormData((prevData) => ({
            ...prevData,
            coordinates: { lat, lng },
            location: `Lat: ${lat}, Lng: ${lng}`,
        }))
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="border border-purple rounded p-4">
                        <h2 className="text-center">Report an Animal</h2>
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}
                        <form
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                        >
                            <div className="mb-3">
                                <label
                                    htmlFor="reportType"
                                    className="form-label"
                                >
                                    Report Type
                                </label>
                                <select
                                    className="form-select"
                                    id="reportType"
                                    name="reportType"
                                    value={formData.reportType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select report type</option>
                                    <option value="Lost">Lost</option>
                                    <option value="Stray">Stray</option>
                                </select>
                            </div>
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
                                <label htmlFor="fixed" className="form-label">
                                    Neutered/Spayed
                                </label>
                                <select
                                    className="form-select"
                                    id="fixed"
                                    name="fixed"
                                    value={formData.fixed}
                                    onChange={handleChange}
                                >
                                    <option value="Unknown">Unknown</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="collar" className="form-label">
                                    Has Collar
                                </label>
                                <input
                                    type="checkbox"
                                    className="form-check-input mx-2"
                                    id="collar"
                                    name="collar"
                                    checked={formData.collar}
                                    onChange={handleChange}
                                />
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
                                <LoadScriptNext googleMapsApiKey={apiKey}>
                                    <GoogleMap
                                        onClick={handleMapClick}
                                        mapContainerStyle={{
                                            height: '400px',
                                            width: '100%',
                                        }}
                                        center={
                                            userLocation || formData.coordinates
                                        }
                                        zoom={13}
                                    >
                                        <Marker
                                            position={formData.coordinates}
                                        />
                                        {userLocation && (
                                            <Marker
                                                position={userLocation}
                                                icon={{
                                                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                                                    scaledSize:
                                                        new window.google.maps.Size(
                                                            30,
                                                            30
                                                        ),
                                                }}
                                            />
                                        )}
                                    </GoogleMap>
                                </LoadScriptNext>
                            </div>

                            {/* File Input for Image */}
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label">
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="d-flex">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'Submit'}
                                </button>
                                <Link
                                    href="/"
                                    className="btn btn-secondary ms-auto"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportAnimal
