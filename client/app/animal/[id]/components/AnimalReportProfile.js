'use client'
import Link from 'next/link'
import { GoogleMap, Marker, LoadScriptNext } from '@react-google-maps/api'
import { useEffect, useState } from 'react'
import styles from '../AnimalReportProfile.module.css';
import EditAnimalModal from './EditAnimalModal';
import useAuth from '@/app/hooks/useAuth'

const AnimalReportProfile = ({ id }) => {
    const { isAuthenticated, user } = useAuth();
    const [reportProfile, setReportProfile] = useState(null) // State for storing single animal report data
    const [loading, setLoading] = useState(true) // State for loading
    const [mapCenter, setMapCenter] = useState({ lat: 51.505, lng: -0.09 }) // Default coordinates for the map
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report/${id}`
                )
                const data = await response.json()
                setReportProfile(data.report) // stores data in the state

                // Set map center based on coordinates from JSON if available
                if (data.report && data.report.location.coordinates) {
                    setMapCenter({
                        lat: data.report.location.coordinates.coordinates[1], // latitude comes second in GeoJSON
                        lng: data.report.location.coordinates.coordinates[0], // longitude comes first
                    })
                }
            } catch (error) {
                console.error('Error fetching animal data: ', error)
            } finally {
                setLoading(false) // stop loading when the fetching of data is complete
            }
        }
        if (id) {
            fetchReportData()
        }
    }, [id])
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (loading) {
        return <div>Loading....</div>
    }

    return (
        <div className="col p-5">
            <div className={`${styles.card} m-3 p-0`}>
                { isAuthenticated && user?._id === reportProfile?.reportedBy._id && (
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-secondary ms-auto" onClick={openModal}>Edit Animal</button>
                        <EditAnimalModal isOpen={isModalOpen} onClose={closeModal} reportData={reportProfile} />
                    </div>
                )}
                <h1 className={`${styles.cardTitle} text-center p-3`}>{reportProfile?.animal?.name}</h1>
                    <div className={`mx-5 p-2`}>
                        <img src={reportProfile?.animal?.imageUrl} className={`${styles.cardImgTop}`} alt={reportProfile?.animal?.name} />
                    </div>
                    <div className={`${styles.cardBody}`}>
                    <p className="card-text">{reportProfile?.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        Reported By: {reportProfile?.reportedBy?.username}
                    </li>
                    <li className="list-group-item">
                        Status: {reportProfile?.reportType}
                    </li>
                    <li className="list-group-item">
                        Species: {reportProfile?.animal?.species}
                    </li>
                    <li className="list-group-item">
                        Breed: {reportProfile?.animal?.breed || 'Unknown'}
                    </li>
                    <li className="list-group-item">
                        Color: {reportProfile?.animal?.color || 'Unknown'}
                    </li>
                    <li className="list-group-item">
                        Gender: {reportProfile?.animal?.gender}
                    </li>
                    <li className="list-group-item">Fixed: {reportProfile?.animal?.fixed}</li>
                    <li className="list-group-item">
                        Collar: {reportProfile?.animal?.collar ? 'Yes' : 'No'}
                    </li>
                    <li className="list-group-item">
                        Date Reported: {reportProfile?.dateReported ? (
                        new Date(reportProfile.dateReported).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                        })
                    ) : 'N/A'}
                </li>
                </ul>
                {reportProfile?.location?.coordinates && (
                    <div className={`${styles.mapContainer} mx-3 mt-2`}>
                        {/* Render Google Map */}
                        <LoadScriptNext
                            googleMapsApiKey={
                                process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                            }
                        >
                            <GoogleMap
                                mapContainerStyle={{
                                height: '400px', // Adjust height to make it smaller
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

export default AnimalReportProfile