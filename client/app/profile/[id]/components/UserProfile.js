import useAuth from '@/app/hooks/useAuth';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import penIcon from "./pen.png";
import styles from './profile.module.css';

const UserProfile = ({ id }) => {
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(true); // State for loading
    const [userData, setUserData] = useState([]);
    const [userFound, setUserFound] = useState(false);
    const [userReports, setUserReports] = useState([]);
    const [selfProfile, setSelfProfile] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    
    useEffect(() => {
        const fetchUser = async () => {      
            try {
                const response1 = await fetch (`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${id}`);
                const userInfo = await response1.json();
                if (!response1.ok) {
                    throw new Error('User not found');
                }
                const response2 = await fetch (`${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report?reportedBy=${id}`)
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




    const handleEdit = () => setIsEdit;

    if (loading) {
        return <div className="spinner-border text-primary" role="status">
        <span className="sr-only"></span>
      </div>;
    }
    if(!userFound) {
        return ( <div><h1>No user exist</h1></div>)
    }
    return (
        <div>
            <div>   
                {isAuthenticated && selfProfile ? (
                    <div className={styles.container}>
                        <h1 className={`${styles.h1} ${styles.userName}`}>Your Profile</h1>
                        <button className={`${styles.button34}`} onClick={handleEdit}>
                            Edit Account Details
                            <Image
                                src={penIcon}
                                alt="Pen Icon"
                                width={30}
                                height={30}
                                priority
                            />
                        </button>
                    </div>
                ) : (
                    <div className='d-flex justify-content-center align-items-center'>
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
                <ul className={styles.ul}>
                    {userReports.map((report) => (
                        <li className={styles.li} key={report._id}>
                            <Link className={styles.dt} href={`/animal/${report._id}`}>{report.animal.name}</Link>
                            <p className={styles.dd}>Report Type: {report.reportType}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
export default UserProfile;