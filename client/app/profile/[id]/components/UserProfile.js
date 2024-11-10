import useAuth from '@/app/hooks/useAuth';
import { useEffect, useState } from 'react';
import styles from './profile.module.css';

const UserProfile = ({ id }) => {
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);
    const [userFound, setUserFound] = useState(false);
    const [selfProfile, setSelfProfile] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${id}`);
                const userInfo = await response.json();
                if (!response.ok) {
                    throw new Error('User not found');
                }
                setUserFound(true);
                setUserData(userInfo);
                if (user) {
                    setSelfProfile(user._id === id);
                }
            } catch (error) {
                console.log('Error fetching user:', error);
                setUserFound(false);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUser();
    }, [id, user]);

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
        <div className={styles.profileBackground}> {/* New background wrapper */}
            <div className={styles.profileContainer}>
                {/* Full-width banner */}
                <div className={styles.profileBanner}></div>

                {/* Profile Image and Username */}
                <div className={styles.profileHeader}>
                    <img
                        src={userData.profileImage || '/backgrounds-stray9.jpg'}
                        alt={`${userData.username}'s profile`}
                        className={styles.profileImage}
                    />
                    <h2 className={styles.userName}>{userData.username}</h2>
                </div>
                
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
