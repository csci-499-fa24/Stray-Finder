'use client';

import Navbar from "@/app/components/layouts/Navbar/Navbar";
import UserProfile from "./components/UserProfile";
import Footer from "@/app/components/layouts/Footer/Footer";
import { useParams, useRouter } from 'next/navigation';
import useAuth from '@/app/hooks/useAuth';

const ProfilePage = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    if (isAuthenticated === false) {
        router.push('/auth');
        return null;
    }

    return (
        <div>
            <Navbar />
            <UserProfile id ={id} />
            <Footer />
        </div>
    )
}

export default ProfilePage;