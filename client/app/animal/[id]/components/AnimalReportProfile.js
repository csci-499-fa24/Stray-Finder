'use client'
import Link from 'next/link';
import { GoogleMap, Marker, LoadScriptNext } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import styles from '../AnimalReportProfile.module.css';
import EditAnimalModal from './EditAnimalModal';
import useAuth from '@/app/hooks/useAuth';
import MessagingInterface from '../../../message/components/MessagingInterface';

const AnimalReportProfile = ({ id }) => {
    const { isAuthenticated, user } = useAuth();
    const [reportProfile, setReportProfile] = useState(null); // State for storing single animal report data
    const [loading, setLoading] = useState(true); // State for loading
    const [mapCenter, setMapCenter] = useState({ lat: 51.505, lng: -0.09 }); // Default coordinates for the map
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mapLoading, setMapLoading] = useState(true);
    const [showMessagingInterface, setShowMessagingInterface] = useState(false);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report/${id}`
                );
                const data = await response.json();
                setReportProfile(data.report); // stores data in the state
                
                // Set map center based on coordinates from JSON if available
                if (data.report && data.report.location.coordinates) {
                    setMapCenter({
                        lat: data.report.location.coordinates.coordinates[1], // latitude comes second in GeoJSON
                        lng: data.report.location.coordinates.coordinates[0], // longitude comes first
                    });
                }
            } catch (error) {
                console.error('Error fetching animal data: ', error);
            } finally {
                setLoading(false); // stop loading when the fetching of data is complete
            }
        };
        if (id) {
            fetchReportData();
        }
    }, [id]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (loading) {
        return <div class="spinner-border text-primary" role="status">
        <span class="sr-only"></span>
      </div>;
    }

    return (
        <div className="col p-5">
            <div className={`${styles.card} m-3 p-0`}>
                {isAuthenticated && user?._id === reportProfile?.reportedBy._id && (
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-secondary ms-auto" onClick={openModal}>Edit Animal</button>
                        <EditAnimalModal isOpen={isModalOpen} onClose={closeModal} reportData={reportProfile} />
                    </div>
                )}
                <h1 className={`${styles.cardTitle} text-center p-3`} style={{ color: 'purple' }}>
                    {reportProfile?.animal?.name}
                </h1>

                {/* Image without circular frame */}
                <div className="d-flex justify-content-center p-3">
                    <img 
                        src={reportProfile?.animal?.imageUrl} 
                        className={`img-fluid ${styles.imageBorder}`} 
                        alt={reportProfile?.animal?.name} 
                    />
                </div>

                <div className={`${styles.cardBody}`}>
                    <p className="card-text">{reportProfile?.description}</p>
                </div>
                <ul className={`${styles.listGroup} list-group list-group-flush`}>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span>Reported By: {reportProfile?.reportedBy?.username}</span>
                        {isAuthenticated && user?._id !== reportProfile?.reportedBy._id && (
                            <button 
                                className="btn btn-primary"
                                onClick={() => setShowMessagingInterface(true)} // Show overlay
                            >
                                Message
                            </button>
                        )}
                    </li>
                    <li className="list-group-item">Status: {reportProfile?.reportType}</li>
                    <li className="list-group-item">Species: {reportProfile?.animal?.species}</li>
                    <li className="list-group-item">Breed: {reportProfile?.animal?.breed || 'Unknown'}</li>
                    <li className="list-group-item">Color: {reportProfile?.animal?.color || 'Unknown'}</li>
                    <li className="list-group-item">Gender: {reportProfile?.animal?.gender}</li>
                    <li className="list-group-item">Fixed: {reportProfile?.animal?.fixed ? 'Yes' : 'No'}</li>
                    <li className="list-group-item">Collar: {reportProfile?.animal?.collar ? 'Yes' : 'No'}</li>
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
                            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                        >
                            {mapLoading && <div class="spinner-border text-primary" role="status"> <span class="sr-only"></span>
                            </div>}
                            <GoogleMap
                                mapContainerStyle={{ height: '400px', width: '100%' }} // Adjust height to make it smaller
                                center={mapCenter}
                                zoom={17}
                                onLoad={() => setMapLoading(false)}
                            >
                                {/* Marker based on animal's coordinates */}
                                <Marker position={mapCenter} />
                            </GoogleMap>
                        </LoadScriptNext>
                    </div>
                )}
                <div className={`${styles.centerButton} d-flex mb-2 mt-3`}>
                    <Link href="/" className="btn btn-secondary ms-auto">
                        Go Back
                    </Link>
                </div>
            </div>
            
            {/* MessagingInterface Overlay */}
            {showMessagingInterface && (
                <div className={`${styles.overlay}`}>
                    <div className={`${styles.overlayContent}`}>
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => setShowMessagingInterface(false)} // Close overlay
                        >
                            Close
                        </button>
                        <MessagingInterface recipientId={reportProfile?.reportedBy?._id} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnimalReportProfile;
