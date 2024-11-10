'use client';

import Navbar from "@/app/components/layouts/Navbar/Navbar";
import UserProfile from "./components/UserProfile";
import Footer from "@/app/components/layouts/Footer/Footer";
import { useParams } from 'next/navigation'; // Import useParams for unwrapping params

const ProfilePage = () => {
    const params = useParams();
    const id = params.id;

    return (
        <div>
            <Navbar />
            <UserProfile id ={id} />
            <Footer />
        </div>
    )
}

export default ProfilePage;