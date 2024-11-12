import useAuth from '@/app/hooks/useAuth';
import { useEffect, useState } from 'react';
import styles from './profile.module.css';
import { FaCamera } from 'react-icons/fa';

const UserProfile = ({ id }) => {
    const { isAuthenticated, user, setUser } = useAuth(); // Added setUser here
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);
    const [userFound, setUserFound] = useState(false);
    const [selfProfile, setSelfProfile] = useState(false);

    useEffect(() => {
        if (user && user._id === id) {
            setSelfProfile(true);
            setUserFound(true);
            setLoading(false);
        } else {
            fetchUser();
        }
    }, [id, user]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${id}`);
            const userInfo = await response.json();
            if (!response.ok) {
                throw new Error('User not found');
            }
            console.log("Fetched User Data:", userInfo);
            setUserFound(true);
            setUserData(userInfo);
        } catch (error) {
            console.log('Error fetching user:', error);
            setUserFound(false);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                console.log("Starting image upload...");
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/profile/upload-profile-image`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }

                const result = await response.json();
                console.log("Uploaded Image URL:", result.profileImage);

                // Update the user state in useAuth to ensure the profile image persists
                setUser((prevUser) => ({
                    ...prevUser,
                    profileImage: result.profileImage,
                }));

                // Update local userData for immediate effect
                setUserData((prevData) => ({
                    ...prevData,
                    profileImage: result.profileImage,
                }));
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };
    
    if (loading) {
        return (
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only"></span>
            </div>
        );
    }

    if (!userFound) {
        return (
            <div>
                <h1>No user exists</h1>
            </div>
        );
    }

    return (
        <div className={styles.profileBackground}>
            <div className={styles.profileContainer}>
                <div className={styles.profileBanner}></div>

                {/* Profile Image and Camera Icon */}
                <div className={styles.profileImageContainer}>
                    <img
                        src={(selfProfile ? user.profileImage : userData.profileImage) || '/backgrounds-stray9.jpg'}
                        alt={`${userData.username || user.username}'s profile`}
                        className={styles.profileImage}
                    />
                    {selfProfile && (
                        <div className={styles.cameraIcon} onClick={() => document.getElementById('fileInput').click()}>
                            <FaCamera />
                        </div>
                    )}
                </div>
                
                <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                {/* Username */}
                <h2 className={styles.userName}>{userData.username || user.username}</h2>

                {/* Profile Details (About Me, Achievements, and Stats) */}
                <div className={styles.profileDetails}>
                    {/* About Me Section */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>About Me</h2>
                        <p className={styles.cardText}>{userData.bio || "Add a bio to tell others about yourself!"}</p>
                    </div>

                    {/* Achievements Section */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Achievements</h2>
                        <div className={styles.badges}>
                            <span className={styles.badge}><i className={styles.badgeIcon}>★</i> Newbie</span>
                            <span className={styles.badge}><i className={styles.badgeIcon}>🐾</i> Helper</span>
                        </div>
                    </div>

                    {/* Profile Stats Section */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Profile Stats</h2>
                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>5</span>
                                <span className={styles.statLabel}>Strays Found</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>80%</span>
                                <span className={styles.statLabel}>Profile Completion</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
