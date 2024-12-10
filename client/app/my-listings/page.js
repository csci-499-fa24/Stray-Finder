"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/app/hooks/useAuth';
import AnimalCard from '../components/cards/AnimalCard';
import Loader from "../components/loader/Loader"
import Navbar from '@/app/components/layouts/Navbar/Navbar';
import Footer from '@/app/components/layouts/Footer/Footer';
import styles from '@/app/profile/[id]/components/profile.module.css';

const MyListings = () => {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userReports, setUserReports] = useState([]);
    const [userFound, setUserFound] = useState(false);

    useEffect(() => {
        if (isAuthenticated === false) {
            router.push('/auth');
            return;
        }

        if (isAuthenticated && user) {
            const fetchUserReports = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report?reportedBy=${user._id}`);
                    const reports = await response.json();

                    if (!response.ok) {
                        throw new Error('Error fetching animal reports');
                    }

                    setUserReports(reports.reports);
                    setUserFound(true);
                } catch (error) {
                    console.error('Error fetching reports:', error);
                    setUserFound(false);
                } finally {
                    setLoading(false);
                }
            };

            fetchUserReports();
        }
    }, [isAuthenticated, user, router]);

    if (loading) {
        return <Loader />;
    }

    if (!userFound) {
        return <div><h1>No reports found</h1></div>;
    }

    return (
        <div className={styles.profileBackground}> {/* New background wrapper */}
            <Navbar />
            <div className={styles.namecontainer}>
                <h1 className={`${styles.h1} ${styles.userName}`}>{user?.username}'s Listings</h1>
            </div>
            <div className={styles.dl}>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 justify-content-center p-2 text-start">
                    {userReports.map((report) => (
                        <AnimalCard
                            key={report?.animal?._id}  // Unique key
                            report_id={report?._id}
                            animal_id={report?.animal?._id}
                            name={report?.animal?.name}
                            username={report?.reportedBy?.username}
                            image={report?.animal?.imageUrl}
                            species={report?.animal?.species}
                            gender={report?.animal?.gender}
                            state={report.reportType}
                            description={report?.animal?.description}
                        />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MyListings;
