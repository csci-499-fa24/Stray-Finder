import { useState, useEffect } from 'react'
import { checkAuthStatus } from '@/app/utils/api'

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const { authenticated, user } = await checkAuthStatus()
                setIsAuthenticated(authenticated)
                setUser(user)
            } catch (error) {
                setIsAuthenticated(false)
                setUser(null)
            }
        }

        verifyAuth()
    }, [])

    return { isAuthenticated, user }
}

export default useAuth
