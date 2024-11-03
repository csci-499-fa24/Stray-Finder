'use client'
import Link from 'next/link'
import useAuth from '@/app/hooks/useAuth'
import './Profile_Menu.css'
import { useRouter } from 'next/navigation' // Update to use next/navigation

const ProfileMenu = () => {
    const { isAuthenticated, user, setIsAuthenticated, setUser, handleLogout } = useAuth() 
    const router = useRouter() // Initialize the router

    const handleLogoutClick = async (event) => {
        event.preventDefault();
        await handleLogout(); 
        router.push('/');
    }
    

    if (!isAuthenticated || !user) {
        return (
            <Link href="/auth" className="login-link" style={{ color: '#67347a' }}>Login</Link>
        );
    }

    //console.log('Authenticated User ID:', user._id); 
    return (
        <div className="user-avatar dropdown">
            <span className="avatar-circle" data-bs-toggle="dropdown" aria-expanded="false">
                {user.username.charAt(0).toUpperCase()}
            </span>
            <ul className="dropdown-menu dropdown-menu-right">
                <li><Link className="dropdown-item" href={`/profile/${user._id}`}>Profile</Link></li>
                <li><Link className="dropdown-item" href="/my-listings">My Listings</Link></li>
                <li><Link className="dropdown-item" href="/settings">Settings</Link></li>
                <li><Link className="dropdown-item" href="/auth" onClick={handleLogoutClick}>Logout</Link></li>
            </ul>
        </div>
    );
}

export default ProfileMenu
