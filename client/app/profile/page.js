'use client'
import { useEffect, useState } from 'react';
import Footer from '../components/layouts/Footer';
import Navbar from '../components/layouts/Navbar/Navbar'; 
import useAuth from '@/app/hooks/useAuth';

function Profile() {    
    const { isAuthenticated } = useAuth();
    const [user, setUser] = useState(null); 

    return (
        <div>
            <Navbar /> 
            <h1>Profile Page</h1>
            {isAuthenticated ? (
                <div>
                    <h2>Welcome back, {}!</h2>
                    <p>Your user ID is: {}</p>
                </div>
            ) : (
                <h2>Please log in to access your profile.</h2>
            )}
        
            <Footer />
        </div>
    )
}

export default Profile;