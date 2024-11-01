import { useEffect, useState } from 'react';
import styles from './profile.module.css';
import Link from 'next/link';

const UserProfile = ({ id }) => {
    const [loading, setLoading] = useState(true); // State for loading
    const [userData, setUserData] = useState([]);
    const [userFound, setUserFound] = useState(false);
    const [userReports, setUserReports] = useState([]);
    
    useEffect(() => {
        const fetchUser = async () => {      
            try {
                const response1 = await fetch (`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${id}`);
                const user = await response1.json();
                if (!response1.ok) {
                    throw new Error('User not found');
                }
                const response2 = await fetch (`${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report?reportedBy=${id}`)
                const reports = await response2.json();
                if (!response2.ok) {
                    throw new Error('error fetching animal reports');
                }
                
                setUserData(user);
                setUserReports(reports.reports);
                setUserFound(true);
            } catch (error) {
                console.log('error fetching userbyid,', error)
                setUserFound(false);
            } finally {
                setLoading(false);
            }
        };
        if (id)
            fetchUser();
    }, [id]); 

    if (loading) {
        return <div class="spinner-border text-primary" role="status">
        <span class="sr-only"></span>
      </div>;
    }

    if(!userFound) {
        return ( <div><h1>No user exist</h1></div>)
    }

    return (
        <div>
            <div>
                <h1 className={`${styles.h1} ${styles.userName}`}>{userData.username}'s Profile</h1>
            </div>
            <div className={styles.dl}>
                <h2 className={styles.userReportsTitle}>{userData.username}'s Reports</h2>
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