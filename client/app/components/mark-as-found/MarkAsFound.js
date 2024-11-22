import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Confetti from 'react-confetti';
import './MarkAsFound.css';

const MarkAsFound = ({ report_id, onClose }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleMarkAsFound = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report/${report_id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        reportType: 'Found',
                    }),
                }
            );

            if (response.ok) {
                setIsSuccess(true); // Trigger confetti
                setTimeout(() => {
                    setIsModalOpen(false);
                    onClose();
                }, 3000);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to mark as found.'}`);
            }
        } catch (error) {
            console.error('Error marking as found:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const modalContent = (
        <div className="modal-overlay">
            <div className="modal-content">
                {isSuccess ? (
                    <>
                        <h4>Success!</h4>
                        <p>
                            The animal report has been successfully marked as "Found."
                            Congratulations!
                        </p>
                        <button
                            className="close-btn"
                            onClick={() => {
                                setIsModalOpen(false);
                                onClose();
                            }}
                        >
                            Close
                        </button>
                        <Confetti
                            width={300} // Confined within modal dimensions
                            height={300}
                            numberOfPieces={150} // Adjust intensity
                            recycle={false}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 1050, // Higher z-index for visibility
                            }}
                        />
                    </>
                ) : (
                    <>
                        <h4>Are you sure?</h4>
                        <p>
                            Marking this report as "Found" will notify other users and
                            remove it from the active list of lost or stray animals.
                        </p>
                        <button className="confirm-btn" onClick={handleMarkAsFound}>
                            Yes, Mark as Found
                        </button>
                        <button
                            className="cancel-btn"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Modal Trigger */}
            <button
                className="mark-as-found-btn"
                onClick={() => setIsModalOpen(true)}
            >
                Mark Found
            </button>

            {/* Confirmation Modal (Rendered via React Portal) */}
            {isModalOpen &&
                ReactDOM.createPortal(
                    modalContent,
                    document.body // Render as a child of <body>
                )}
        </>
    );
};

export default MarkAsFound;
