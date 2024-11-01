'use client';

import Navbar from "@/app/components/layouts/Navbar/Navbar";
import UserProfile from "./components/UserProfile";
import Footer from "@/app/components/layouts/Footer";

const ProfilePage = async ({ params }) => {
    const { id } = await params;

    return (
        <div>
            <Navbar />
            <UserProfile id ={id} />
            <Footer />
        </div>
    )
}

export default ProfilePage;