import useAuth from '@/app/hooks/useAuth';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import EditProfile from './EditProfile';
import PenIcon from './PenIcon';
import styles from './profile.module.css'
import ChangePassword from './ChangePassword';
import AnimalCard from '../../../components/cards/AnimalCard.js';

const UserProfile = ({ id }) => {
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(true); // State for loading
    const [userData, setUserData] = useState([]);
    const [userFound, setUserFound] = useState(false);
    const [userReports, setUserReports] = useState([]);
    const [selfProfile, setSelfProfile] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response1 = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${id}`);
                const userInfo = await response1.json();
                if (!response1.ok) {
                    throw new Error('User not found');
                }
                const response2 = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report?reportedBy=${id}`)
                const reports = await response2.json();
                if (!response2.ok) {
                    throw new Error('error fetching animal reports');
                }

                setUserFound(true);
                setUserData(userInfo);
                setUserReports(reports.reports);
                if (user) {
                    setSelfProfile(user._id === id);
                }
            } catch (error) {
                console.log('error fetching userbyid,', error)
                setUserFound(false);
            } finally {
                setLoading(false);
            }
        };
        if (id)
            fetchUser();
    }, [id, user]);

    if (loading) {
        return <div className="spinner-border text-primary" role="status">
            <span className="sr-only"></span>
        </div>;
    }
    if (!userFound) {
        return (<div><h1>No user exist</h1></div>)
    }
    return (
        <div>
            <div>
                {isAuthenticated && selfProfile ? (
                    <div className={styles.namecontainer}>
                        <h1 className={`${styles.h1} ${styles.userName}`}>{userData.username}'s Profile</h1>
                        <div className={styles.buttonContainer}>
                            <button className={`${styles.button34}`} onClick={() => setIsEdit(true)}>
                                Edit Account Details
                                <PenIcon length={30} />
                            </button>
                            <button className={`${styles.button34}`} onClick={() => setIsChangePassword(true)}>
                                Change Password
                                <PenIcon length={30} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.namecontainer}>
                        <h1 className={`${styles.h1} ${styles.userName}`}>{userData.username}'s Profile</h1>
                    </div>
                )}
            </div>
            <div className={styles.dl}>
                {isAuthenticated && selfProfile ? (
                    <h2 className={styles.userReportsTitle}>Your Reports</h2>
                ) : (
                    <h2 className={styles.userReportsTitle}>{userData.username}'s Reports</h2>
                )}
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 justify-content-center p-2 text-start">
                    {userReports.map((report) => (
                        <AnimalCard
                            key={report?.animal?._id}  // Unique key
                            report_id={report?._id}
                            animal_id={report?.animal?._id}
                            name={report?.animal?.name}
                            image={report?.animal?.imageUrl}
                            species={report?.animal?.species}
                            gender={report?.animal?.gender}
                            state="Unknown"  // Replace with actual state if available
                            description={report?.animal?.description}
                        />
                    ))}
                </div>
            </div>
            <EditProfile user={user} isOpen={isEdit} onClose={() => setIsEdit(false)}>
                <button onClick={() => setIsEdit(false)}></button>
            </EditProfile>

            <ChangePassword isOpen={isChangePassword} onClose={() => setIsChangePassword(false)}>
                <button onClick={() => setIsChangePassword(false)}></button>
            </ChangePassword>
        </div>
    );
};
export default UserProfile;