import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api'
import DeleteAnimalModal from './DeleteAnimalModal';

const EditAnimalModal = ({ isOpen, onClose, reportData }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
        imageUrl: '',
        coordinates: {
            lat: 40.768,
            lng: -73.964,
        },
    });
    
    useEffect(() => {
        if (reportData) {
            setFormData({
                reportType: reportData?.reportType || '',
                name: reportData?.animal?.name || '',
                species: reportData?.animal?.species || '',
                breed: reportData?.animal?.breed || '',
                color: reportData?.animal?.color || '',
                gender: reportData?.animal?.gender || 'Unknown',
                fixed: reportData?.animal?.fixed || 'Unknown',
                collar: reportData?.animal?.collar || false,
                description: reportData?.description || '',
                location: `Lat: ${reportData?.location?.coordinates?.coordinates[1]}, Lng: ${reportData?.location?.coordinates?.coordinates[0]}` || '',
                imageUrl: reportData?.animal?.imageUrl || '',
                coordinates: {
                    lat: reportData?.location?.coordinates?.coordinates[1] || 40.768,
                    lng: reportData?.location?.coordinates?.coordinates[0] || -73.964,
                },
            });
        }
    }, [reportData]);
    

    const [file, setFile] = useState(null); // Store the image file
    const [isOtherBreed, setIsOtherBreed] = useState(false);
    const [otherBreed, setOtherBreed] = useState(reportData?.animal?.breed);
    const [commonBreeds, setCommonBreeds] = useState([]);
    const [loading, setLoading] = useState(false)
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
                "Other",
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
                "Other",
            ],
        },
        {
            value: 'Rabbit',
            label: 'Rabbit',
            breeds: [
                'Holland Lop',
                'Netherland Dwarf',
                'Mini Rex',
                'Lionhead',
                'Flemish Giant',
                "I don't know",
            ],
        },
        {
            value: 'Hamster',
            label: 'Hamster',
            breeds: [
                'Syrian',
                'Dwarf',
                'Roborovski',
                'Chinese',
                "I don't know",
            ],
        },
        {
            value: 'Guinea Pig',
            label: 'Guinea Pig',
            breeds: [
                'American',
                'Abyssinian',
                'Peruvian',
                'Silkie',
                "I don't know",
            ],
        },
        {
            value: 'Lizard',
            label: 'Lizard',
            breeds: [
                'Leopard Gecko',
                'Bearded Dragon',
                'Crested Gecko',
                'Chameleon',
                "I don't know",
            ],
        },
        {
            value: 'Pig',
            label: 'Pig',
            breeds: [
                'Miniature',
                'Teacup',
                'Pot-bellied',
                "I don't know",
            ],
        },
        {
            value: 'Bird',
            label: 'Bird',
            breeds: [
                'Parakeet',
                'Cockatiel',
                'Canary',
                'Lovebird',
                "I don't know",
            ],
        },
        {
            value: 'Ferret',
            label: 'Ferret',
            breeds: ["I don't know"], // Ferrets don't have many distinct breeds
        },
        { 
            value: 'Unknown', 
            label: "I don't know", 
            breeds: [] 
        },
    ];    

    useEffect(() => {
        // disable scrolling
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset'; // Reset to default
        }

        // Cleanup function to reset styles when the component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        // Set initial breeds based on the selected species
        const selectedSpecies = speciesOptions.find(species => species.value === formData.species);
        const initialBreeds = selectedSpecies ? selectedSpecies.breeds : [];

        // Only update commonBreeds if it has changed
        setCommonBreeds((prevBreeds) => {
            const updatedBreeds = [...initialBreeds];

            // Add otherBreed if it's not already in the list
            if (otherBreed && !updatedBreeds.includes(otherBreed)) {
                updatedBreeds.push(otherBreed);
            }

            // Only update if there's a difference
            if (JSON.stringify(prevBreeds) !== JSON.stringify(updatedBreeds)) {
                return updatedBreeds;
            }
            return prevBreeds;
        });
    }, []);

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
            setIsOtherBreed(false); // Reset Other option when species changes
        };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

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
        uploadData.append('reportedBy', reportData?.reportedBy?._id); // Add user ID

        // Create the location data in GeoJSON format
        const locationData = {
            address: 'Unknown', // Default to 'Unknown' if no address is provided
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
        if (!file && formData.imageUrl) {
            uploadData.append('image', formData.imageUrl); // Keep the existing image URL
        } else if (file) {
            uploadData.append('image', file); // Append the new file
        }

        const animal_id = reportData?.animal?._id;
        const report_id = reportData?._id;
        try {
            const requestOptions = {
                method: 'PUT',
                body: uploadData, // Use uploadData
                credentials: 'include',
            };

            const response1 = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal/${animal_id}`,
                requestOptions
            );
            const response2 = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report/${report_id}`, 
                requestOptions
            );
            
            if (!response1.ok || !response2.ok) {
                throw new Error('Failed to update animal or animal report');
            }

        } catch (error) {
            console.error('Error updating animal or animal report data: ', error);
        }
            window.location.reload();
    }

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setFormData((prevData) => ({
            ...prevData,
            coordinates: { lat, lng },
            location: `Lat: ${lat}, Lng: ${lng}`,
        }));
    };


    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!isOpen) return null;
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Animal Details"
            ariaHideApp={false}
            style={{
                content: {
                    maxWidth: '1000px', // Adjust this value to your preference
                    margin: 'auto', // Center the modal
                },
            }}
        >
            <div className="container my-4 row justify-content-center">
                <div className="d-flex justify-center">
                    <h3 className="text-center ms-auto">{reportData?.animal?.name}'s Report</h3>
                    <button className="btn btn-danger ms-auto" onClick={openDeleteModal}>Delete</button>
                    <DeleteAnimalModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} report_id={reportData?._id} animal_id={reportData?.animal?._id} />
                </div>
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
                            <option value="Found">Found</option>
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
                            value={
                                isOtherBreed
                                    ? 'Other'
                                    : formData.breed
                            } // Set to 'Other' if isOtherBreed is true
                            onChange={handleChange}
                            required
                            disabled={formData.species === 'Unknown'}
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
                                placeholder={reportData?.breed}
                                value={reportData?.breed} // Use formData.breed for custom input
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        breed: e.target.value, // Update breed directly from input
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
                            required
                        >
                            <option value="Unknown">Unknown</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="fixed" className="form-label">
                            Is it fixed?
                        </label>
                        <select
                            className="form-select"
                            id="fixed"
                            name="fixed"
                            value={formData.fixed}
                            onChange={handleChange}
                            required
                        >
                            <option value="Unknown">Unknown</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="collar" className="form-label">
                            Does it have a collar?
                        </label>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="collar"
                            name="collar"
                            checked={formData.collar}
                            onChange={handleChange}
                        />
                        <label
                            className="form-check-label"
                            htmlFor="collar"
                        >
                            Yes
                        </label>
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
                        <label htmlFor="file" className="form-label">
                            Upload Image (optional)
                        </label>
                        {formData.imageUrl && (
                            <div className="mb-3">
                                <label>Current Image:</label>
                                <img
                                    src={formData.imageUrl}
                                    alt={`${formData.name}'s current`}
                                    style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '10px' }}
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            className="form-control"
                            id="file"
                            name="file"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="map" className="form-label">
                            Select Location on Map
                        </label>
                        <LoadScriptNext
                            googleMapsApiKey={apiKey}
                        >
                            <GoogleMap
                                onClick={handleMapClick}
                                mapContainerStyle={{
                                    height: '300px',
                                    width: '100%',
                                }}
                                center={formData.coordinates}
                                zoom={15}
                            >
                                <Marker
                                    position={formData.coordinates}
                                />
                            </GoogleMap>
                        </LoadScriptNext>
                    </div>
                    <div className='d-flex'>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Finish Editing'}
                        </button>
                        <button className='btn btn-secondary ms-auto' onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};


export default EditAnimalModal
