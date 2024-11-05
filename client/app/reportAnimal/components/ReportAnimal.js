import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import useAuth from '@/app/hooks/useAuth';
import toast from 'react-hot-toast';

const ReportAnimal = () => {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth(); // Get user and authentication status from useAuth
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
    });

    const [file, setFile] = useState(null); // Store the image file
    const [isOtherBreed, setIsOtherBreed] = useState(false);
    const [commonBreeds, setCommonBreeds] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [locationAsked, setLocationAsked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        { value: 'Unknown', label: "I don't know", breeds: [] },
    ];

    useEffect(() => {
        if (isAuthenticated === false) {
            router.push('/auth'); // Redirect to login if not authenticated
        }

        if (isAuthenticated && navigator.geolocation && !locationAsked) {
            const askForLocation = window.confirm(
                'Would you like to share your location?'
            );
            if (askForLocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setUserLocation({ lat: latitude, lng: longitude });
                        setFormData((prevData) => ({
                            ...prevData,
                            coordinates: { lat: latitude, lng: longitude },
                            location: `Lat: ${latitude}, Lng: ${longitude}`,
                        }));
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        alert(
                            'Unable to retrieve your location. Please enter it manually.'
                        );
                    }
                );
            }
            setLocationAsked(true);
        }
    }, [isAuthenticated, locationAsked, router]);

    if (isAuthenticated === null) {
        return (
            <div
                className="d-flex justify-content-center align-items-center vh-100"
                style={{ marginTop: "-50px" }} // Adjust as needed for vertical alignment
            >
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
        );
    }

    if (isAuthenticated === false) {
        return null; // Return nothing if the user is not authenticated (will redirect)
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (name === 'species') {
            const selectedSpecies = speciesOptions.find(
                (species) => species.value === value
            );
            setCommonBreeds(selectedSpecies ? selectedSpecies.breeds : []);
            setFormData((prevData) => ({
                ...prevData,
                breed: '', // Reset breed when species changes
            }));
            setIsOtherBreed(false); // Reset Other option when species changes
        }

        // Handling breed selection
        if (name === 'breed') {
            // Check if 'Other' is selected to allow user input
            if (value === 'Other') {
                setIsOtherBreed(true);
                // Maintain current breed value so it doesn't reset
                setFormData((prevData) => ({
                    ...prevData,
                    breed: prevData.breed, // Maintain the custom input if it's already typed
                }));
            } else {
                setIsOtherBreed(false);
                // Update the breed in formData directly for the dropdown selection
                setFormData((prevData) => ({
                    ...prevData,
                    breed: value,
                }));
            }
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Store the selected file
    };

    const MAX_DISTANCE_MILES = 10;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        // Calculate and check the distance before submitting (Newly Added Code)
        const userLat = userLocation.lat;
        const userLng = userLocation.lng;
        const reportLat = formData.coordinates.lat;
        const reportLng = formData.coordinates.lng;
    
        const distance = calculateDistance(userLat, userLng, reportLat, reportLng); // Newly Added Line
    
        if (distance > MAX_DISTANCE_MILES) {
            const errorMessage = `Reports are only allowed within ${MAX_DISTANCE_MILES} miles of your location.`;
            setError(errorMessage);
            toast.error(errorMessage); // Toast notification for error
            setLoading(false);
            return;
        }
    
        // Prepare FormData for the image and other form data
        const uploadData = new FormData();
        uploadData.append('reportType', formData.reportType);
        uploadData.append('name', formData.name);
        uploadData.append('species', formData.species);
        uploadData.append('breed', formData.breed);
        uploadData.append('color', formData.color);
        uploadData.append('gender', formData.gender);
        uploadData.append('fixed', formData.fixed);
        uploadData.append('collar', formData.collar);
        uploadData.append('description', formData.description);
        uploadData.append('reportedBy', user._id); // Add user ID
    
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
        };
    
        // Append location as a stringified JSON object
        uploadData.append('location', JSON.stringify(locationData));
    
        // If an image file is selected, append it to the FormData
        if (file) {
            uploadData.append('image', file);
        }
    
        try {
            const requestOptions = {
                method: 'POST',
                body: uploadData, // Use FormData
                credentials: 'include',
            };
    
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report`,
                requestOptions
            );
            
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
    
            const result = await response.json();
            console.log('Form submitted successfully:', result);
            router.push('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 3959; // Radius of the Earth in miles
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in miles
        return distance;
    };
    

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setFormData((prevData) => ({
            ...prevData,
            coordinates: { lat, lng },
            location: `Lat: ${lat}, Lng: ${lng}`,
        }));
    };
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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
                                    <option value="Found">Found</option> {/* Added new option */}
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
                                        <option key={species.value} value={species.value}>
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
                                    <option value="Other">Other</option>
                                </select>
                                {isOtherBreed && (
                                    <input
                                        type="text"
                                        className="form-control mt-2"
                                        placeholder="Please specify other breed"
                                        value={formData.breed}
                                        onChange={handleChange}
                                        name="breed" // Ensure the breed name is consistent
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
                                    required
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
                                    Is the animal fixed?
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
                                    Does the animal have a collar?
                                </label>
                                <input
                                    type="checkbox"
                                    id="collar"
                                    name="collar"
                                    checked={formData.collar}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">
                                    Description
                                </label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="location" className="form-label">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <LoadScriptNext googleMapsApiKey={apiKey}>
                                    <GoogleMap
                                        mapContainerStyle={{ height: '400px', width: '100%' }}
                                        center={formData.coordinates}
                                        zoom={12}
                                        onClick={handleMapClick}
                                    >
                                        <Marker position={formData.coordinates} />
                                    </GoogleMap>
                                </LoadScriptNext>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="file" className="form-label">
                                    Upload Image (optional)
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="file"
                                    name="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
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
    );
};

export default ReportAnimal;
