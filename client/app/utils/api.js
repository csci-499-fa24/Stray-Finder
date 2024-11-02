export const checkAuthStatus = async () => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/auth`,
            {
                method: 'GET',
                credentials: 'include',
            }
        )

        if (response.ok) {
            const authData = await response.json()
            if (authData.authenticated) {
                // Fetch user details from /api/user
                const userResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user`,
                    {
                        method: 'GET',
                        credentials: 'include',
                    }
                )

                if (userResponse.ok) {
                    const userData = await userResponse.json()
                    return { authenticated: true, user: userData } // Return the user data along with authenticated status
                }
            }
        }
        return { authenticated: false, user: null } // Return false if not authenticated
    } catch (error) {
        console.error('Error checking authentication:', error)
        return { authenticated: false, user: null }
    }
}

export const registerUser = async (username, email, password) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/register`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
                credentials: 'include',
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Registration failed')
        }

        return await response.json()
    } catch (error) {
        console.error('Registration failed', error)
        throw error
    }
}

export const loginUser = async (username, password) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Login failed')
        }

        return await response.json()
    } catch (error) {
        console.error('Login failed', error)
        throw error
    }
}

export const logoutUser = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        
        if (!response.ok) {
            throw new Error('Failed to logout');
        }
        
        localStorage.removeItem('token');
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

