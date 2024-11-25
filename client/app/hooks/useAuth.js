import { useState, useEffect } from 'react'
import { checkAuthStatus, logoutUser } from '@/app/utils/api'  

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Start with null to indicate status is unknown
    const [user, setUser] = useState(null);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const { authenticated, user } = await checkAuthStatus();
                setIsAuthenticated(authenticated);
                setUser(user);
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
            }
        };

        verifyAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();  
            setIsAuthenticated(false);  
            setUser(null);    
            window.location.reload();
        } catch (error) {
            console.error("Logout failed", error);  
        }
    };

    return { isAuthenticated, user, setUser, handleLogout };
}

export default useAuth