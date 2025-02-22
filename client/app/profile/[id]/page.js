'use client';

import Navbar from "@/app/components/layouts/Navbar/Navbar";
import UserProfile from "./components/UserProfile";
import Footer from "@/app/components/layouts/Footer/Footer";
import { useParams, useRouter } from 'next/navigation';
import useAuth from '@/app/hooks/useAuth';
import { useEffect } from 'react';

const ProfilePage = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        if (isAuthenticated === false) {
            router.push('/auth');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null; // Prevent rendering until authentication is verified
    }

    return (
        <div>
            <Navbar />
            <UserProfile id={id} />
            <Footer />
        </div>
    );
}

export default ProfilePage;
