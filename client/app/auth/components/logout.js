'use client';
import { useRouter } from 'next/navigation'; // Use the App Router's `useRouter`

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include', // Include cookies in the request
            });

            if (!response.ok) {
                throw new Error('Failed to logout');
            }

            const result = await response.json();
            console.log(result.message);
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
