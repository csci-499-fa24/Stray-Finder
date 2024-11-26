'use client'
import Link from 'next/link'
import useAuth from '@/app/hooks/useAuth'
import './Profile_Menu.css'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUnreadMessages } from '@/app/context/UnreadMessagesContext';


const ProfileMenu = () => {
    const { isAuthenticated, user, setIsAuthenticated, setUser, handleLogout } = useAuth()
    const { hasUnreadMessages, setHasUnreadMessages } = useUnreadMessages();
    const router = useRouter()

    const handleLogoutClick = async (event) => {
        event.preventDefault();
        await handleLogout();
        router.refresh()
    }

    useEffect(() => {
        // Fetch unread messages status on initial render if user is authenticated
        async function checkUnreadMessages() {
            if (isAuthenticated && user) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/message/last-messages`, {
                        credentials: 'include'
                    });
                    const data = await response.json();
                    const unread = data.some(msg => msg.senderId !== user._id && !msg.read);
                    setHasUnreadMessages(unread);
                } catch (error) {
                    console.error('Error checking unread messages:', error);
                }
            }
        }

        checkUnreadMessages(); // Run the function on mount
    }, [isAuthenticated, user]);

    // if (!isAuthenticated || !user) {
    //     return (
    //       <Link href="/auth" className="login-link" style={{ color: '#67347a' }}>Login</Link>
    //     );
    //   } REMOVING THIS TO AVOID LOGIN BUTTON/LINK RENDERING TWICE. IF ANYTHING BREAKS BRING THIS BACK!
      
    if (!user) { //REPLACED THE ABOVE WITH THIS!!
        return null; 
      }      

    return (
        <div className="user-avatar dropdown">
            <span className="avatar-circle" data-bs-toggle="dropdown" aria-expanded="false">
                {user.profileImage ? (
                    <img
                        src={user.profileImage}
                        alt={`${user.username}'s profile`}
                        className="profile-avatar-image"
                    />
                ) : (
                    user.username.charAt(0).toUpperCase()
                )}
                {hasUnreadMessages && <span className="unread-dot-profile"></span>}
            </span>
            <ul className="dropdown-menu dropdown-menu-right">
                <li>
                    <Link className="dropdown-item" href={`/profile/${user._id}`}>Profile</Link>
                </li>
                <li>
                    <Link className="dropdown-item" href="/my-listings">My Listings</Link>
                </li>
                <li>
                    <Link className="dropdown-item" href="/userMessages">
                        Messages {hasUnreadMessages && <span className="unread-dot-dropdown"></span>}
                    </Link>
                </li>
                <li>
                    <Link className="dropdown-item" href="/settings">Settings</Link>
                </li>
                <li>
                    <Link className="dropdown-item" href="/auth" onClick={handleLogoutClick}>Logout</Link>
                </li>
            </ul>
        </div>
    );
}

export default ProfileMenu;
