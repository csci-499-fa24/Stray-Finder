'use client'
import Link from 'next/link'
import useAuth from '@/app/hooks/useAuth'
import './Profile_Menu.css'

const ProfileMenu = () => {
    const { isAuthenticated, user } = useAuth()

    if (!isAuthenticated || !user) {
        return (
            <Link href="/auth" className="login-link" style={{ color: '#67347a' }}>Login</Link>
        )
    }

    return (
        <div className="user-avatar dropdown">
            <span className="avatar-circle" data-bs-toggle="dropdown" aria-expanded="false">
                {user.username.charAt(0).toUpperCase()}
            </span>
            <ul className="dropdown-menu dropdown-menu-right">
                <li><Link className="dropdown-item" href={`/profile/${user._id}`}>Profile</Link></li>
                <li><Link className="dropdown-item" href="/my-listings">My Listings</Link></li>
                <li><Link className="dropdown-item" href="/settings">Settings</Link></li>
            </ul>
        </div>
    )
}

export default ProfileMenu