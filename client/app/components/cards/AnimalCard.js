import Link from 'next/link';
import { useState } from 'react';

const AnimalCard = ({ report_id, animal_id, name, image, species, gender, state, description }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);  // New state for login modal

    // Function to handle reporting
    const handleReportClick = () => {
        setModalOpen(true);  // Open the modal when Report is clicked
    };

    // Function to submit report
    const submitReport = async () => {
        if (!selectedReason) {
            alert('Please select a reason for reporting.');
            return;
        }

        console.log("Submitting report...");

        //KEEP FULL URL until production when everything is hosted on the same domain
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/report/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    animalId: animal_id,
                    description: 'A report was made about the posting associated with that animal ID',
                    reason: selectedReason,
                }),
            });

            if (response.ok) {
                console.log('Report submitted successfully');
                alert('Report submitted successfully!');
            } else if (response.status === 401) {
                // If not authenticated, show login modal
                setLoginModalOpen(true);
            } else {
                const errorData = await response.json();
                alert(`Failed to submit report: ${errorData.message || 'Please try again.'}`);
            }

            setModalOpen(false);
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('An error occurred while submitting the report.');
        }
    };

    return (
        <div className="col position-relative">
            <div className="card m-3 p-0">
                <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden' }}>
                    <img
                        src={image}
                        alt={name}
                        style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <p className="card-text">{description}</p>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Species: {species}</li>
                    <li className="list-group-item">Gender: {gender}</li>
                    <li className="list-group-item">State: {state}</li>
                </ul>
                <div className="card-body">
                    <Link href={`/animal/${report_id}`} className="card-link">
                        Read More
                    </Link>
                    <button className="report-btn" onClick={handleReportClick}>
                        Report
                    </button>
                </div>

                {/* Modal for reporting */}
                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h4>Report Post</h4>
                            <p>Why do you want to report this post?</p>
                            <select value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)}>
                                <option value="">Select a reason</option>
                                <option value="Spam">Spam</option>
                                <option value="Offensive Content">Offensive Content</option>
                                <option value="Inaccurate Information">Inaccurate Information</option>
                            </select>
                            <button onClick={submitReport}>Submit Report</button>
                            <button onClick={() => setModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                {/* Modal for login */}
                {isLoginModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h4>User must be logged in</h4>
                            <p>Please log in to submit a report.</p>
                            <Link href="/login">
                                <button className="btn-purple btn">Log In</button>
                            </Link>
                            <button onClick={() => setLoginModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnimalCard;
