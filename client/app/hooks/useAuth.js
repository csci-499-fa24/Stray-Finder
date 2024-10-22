import { useState, useEffect } from 'react'
import { checkAuthStatus } from '@/app/utils/api'

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const authenticated = await checkAuthStatus()
                setIsAuthenticated(authenticated)
            } catch (error) {
                setIsAuthenticated(false)
            }
        }

        verifyAuth()
    }, [])

    return { isAuthenticated }
}

export default useAuth