import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FaEllipsisV, FaCommentDots } from 'react-icons/fa';
import CommentModal from '../../components/comments/CommentModal';
import './AnimalDropdown.css';

const AnimalCard = ({ report_id, animal_id, name, username, image, species, gender, state, description }) => {
    const currentPath = usePathname();

    const [isModalOpen, setModalOpen] = useState(false); // State for report modal
    const [selectedReason, setSelectedReason] = useState('');
    const [isLoginModalOpen, setLoginModalOpen] = useState(false); // State for login modal
    const [isDropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false); // State for comment modal
    const [commentCount, setCommentCount] = useState(0); // State for comment count

    // Fetch the comment count for this report
    useEffect(() => {
        async function fetchCommentCount() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/comments/${report_id}/count`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setCommentCount(data.count || 0);
                } else {
                    console.error('Failed to fetch comment count.');
                }
            } catch (error) {
                console.error('Error fetching comment count:', error);
            }
        }

        fetchCommentCount();
    }, [report_id]);

    // Toggle Dropdown
    const toggleDropdown = () => {
        setDropdownOpen((prevState) => !prevState);
    };

    // Toggle the comment modal
    const handleCommentIconClick = () => {
        setIsCommentModalOpen(true);
    };

    // Handle Report Click
    const handleReportClick = (event) => {
        event.stopPropagation(); // Prevent dropdown from closing
        setModalOpen(true); // Open the modal
        setDropdownOpen(false); // Close dropdown after opening modal
    };

    // Submit Report
    const submitReport = async () => {
        if (!selectedReason) {
            alert('Please select a reason for reporting.');
            return;
        }

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
                alert('Report submitted successfully!');
            } else if (response.status === 401) {
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
        <div className="col position-relative d-flex justify-content-center align-items-center">
            <div className="card m-3 p-0">
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <img
                        src={image || '/paw-pattern.jpg'}
                        alt={name}
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                    {/* Dropdown toggle */}
                    <div className="animal-dropdown-container">
                        <button
                            className="animal-dropdown-toggle"
                            onClick={toggleDropdown}
                            aria-label="Options"
                        >
                            <FaEllipsisV />
                        </button>
                        {isDropdownOpen && (
                            <div className="animal-dropdown-menu show">
                                <button
                                    className="animal-dropdown-item"
                                    onClick={handleReportClick}
                                    aria-label="Report"
                                >
                                    Report
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Card Bottom Section */}
                <div className="card-bottom">
                    <div className="card-body">
                        <h5 className="card-title">{name}</h5>
                        <p className="card-text">{description}</p>
                    </div>
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <Link
                            href={`/animal/${report_id}?from=${currentPath}`}
                            className="card-link"
                        >
                            Read More
                        </Link>
                        <div
                            className="comment-icon-container"
                            onClick={handleCommentIconClick}
                        >
                            <FaCommentDots className="comment-icon" />
                            <span className="comment-count">
                                {commentCount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Modal for reporting */}
                {isModalOpen && (
                    <div
                        className="modal"
                        style={{ display: isModalOpen ? 'flex' : 'none' }}
                    >
                        <div className="modal-content">
                            <h4>Report Post</h4>
                            <p>Why do you want to report this post?</p>
                            <select
                                value={selectedReason}
                                onChange={(e) =>
                                    setSelectedReason(e.target.value)
                                }
                            >
                                <option value="">Select a reason</option>
                                <option value="Spam">Spam</option>
                                <option value="Offensive Content">
                                    Offensive Content
                                </option>
                                <option value="Inaccurate Information">
                                    Inaccurate Information
                                </option>
                            </select>
                            <button onClick={submitReport}>
                                Submit Report
                            </button>
                            <button onClick={() => setModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal for login */}
                {isLoginModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h4>User must be logged in</h4>
                            <p>Please log in to submit a report.</p>
                            <Link href="/auth">
                                <button className="btn-purple btn">
                                    Log In
                                </button>
                            </Link>
                            <button onClick={() => setLoginModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Comment Modal */}
                {isCommentModalOpen && (
                    <CommentModal
                        animalId={animal_id}
                        reportId={report_id}
                        image={image}
                        description={description}
                        reportedByUsername={username}
                        onClose={() => setIsCommentModalOpen(false)}
                        onCommentAdded={() =>
                            setCommentCount((prevCount) => prevCount + 1)
                        }
                    />
                )}
            </div>
        </div>
    )
};

export default AnimalCard;
