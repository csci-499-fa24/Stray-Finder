'use client';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = () => {
        try {
            // Clear the token cookie by setting an expired date
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
            console.log('Token cookie removed');

            // Redirect to the login page or homepage after logging out
            router.push('/auth'); // Adjust as needed
        } catch (error) {
            console.error('Logout error:', error);
            alert('An error occurred while logging out');
        }
    };

    return (
        <button onClick={handleLogout} className="btn btn-danger">
            Logout
        </button>
    );
};

export default LogoutButton;
