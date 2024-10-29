import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api'
import DeleteAnimalModal from './DeleteAnimalModal';

const EditAnimalModal = ({ isOpen, onClose, reportData }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        reportType: reportData?.reportType || '',
        name: reportData?.animal?.name || '',
        species: reportData?.animal?.species || '',
        breed: reportData?.animal?.breed || '',
        color: reportData?.animal?.color || '',
        gender: reportData?.animal?.gender || 'Unknown',
        fixed: reportData?.animal?.fixed || 'Unknown',
        collar: reportData?.animal?.collar || false,
        description: reportData?.description || '',
        location: reportData?.address || '',
        imageUrl: reportData?.animal?.imageUrl || '',
        coordinates: {
            lat: reportData?.location?.coordinates?.coordinates[1] || 51.505,
            lng: reportData?.location?.coordinates?.coordinates[0] || -0.09,
        },
    });

    const [isOtherBreed, setIsOtherBreed] = useState(false);
    const [commonBreeds, setCommonBreeds] = useState([]);
    const [mapCenter, setMapCenter] = useState(formData.coordinates);
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
    ]


    useEffect(() => {
        // set map mapCenter
        setMapCenter(formData.coordinates);

        // Set initial breeds based on the selected species
        const selectedSpecies = speciesOptions.find(species => species.value === formData.species);
        const newBreeds = selectedSpecies ? selectedSpecies.breeds : [];

        // Only update commonBreeds if it has changed
        setCommonBreeds((prevBreeds) => {
            if (JSON.stringify(prevBreeds) !== JSON.stringify(newBreeds)) {
                return newBreeds;
            }
            return prevBreeds;
        });

    }, [formData.coordinates, formData.species, speciesOptions]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        const formattedData = {
            ...formData,
            location: {
                address: formData.location,
                coordinates: {
                    type: 'Point',
                    coordinates: [
                        formData.coordinates.lng,
                        formData.coordinates.lat,
                    ],
                },
            },
        }

        const animal_id = reportData?.animal?._id;
        const report_id = reportData?._id;
        try {
            const response1 = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal/${animal_id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
                credentials: 'include',
            });
            const response2 = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report/${report_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
                credentials: 'include',
            });
            
            if (!response1.ok || !response2.ok) {
                throw new Error('Failed to update animal or animal report');
            }

        } catch (error) {
            console.error('Error updating animal or animal report data: ', error);
        }
            window.location.reload();
    }

    const handleMapClick = (event) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        setFormData((prevData) => ({
            ...prevData,
            coordinates: { lat, lng },
        }))
    }


    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Animal Details"
        >
            <div>
            <form onSubmit={handleSubmit}>
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
                        disabled={formData.species === "Unknown"}
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
                            center={mapCenter}
                            zoom={13}
                        >
                            <Marker
                                position={formData.coordinates}
                            />
                        </GoogleMap>
                    </LoadScriptNext>
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
                <div className="d-flex">
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
                <div className="d-flex">
                    <br></br>
                    <button className="btn btn-danger ms-auto" onClick={openDeleteModal}>Delete</button>
                    <DeleteAnimalModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} report_id={reportData?._id} animal_id={reportData?.animal?._id} />
                </div>
            </div>
        </Modal>
    );
};


export default EditAnimalModal