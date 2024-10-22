export const checkAuthStatus = async () => {
    try {
        console.log('TAPPED HERE')
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/auth`,
            {
                method: 'GET',
                credentials: 'include',
            }
        )

        if (response.ok) {
            const data = await response.json()
            return data.authenticated
        }
        return false
    } catch (error) {
        console.error('Error checking authentication:', error)
        return false
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

// export const logoutUser = async () => {
//     try {
//         await fetch('/api/auth/logout', {
//             method: 'POST',
//             credentials: 'include',
//         })
//     } catch (error) {
//         console.error('Error logging out:', error)
//     }
// }
