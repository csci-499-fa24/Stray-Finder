import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ReportLost from '../../reportlost/components/ReportLost'
import useAuth from '@/app/hooks/useAuth' // Assuming your useAuth hook is in utils

const SpottedStrayCard = () => {
    const { isAuthenticated } = useAuth() // Get authentication status
    const [showReportLost, setShowReportLost] = useState(false)
    const router = useRouter() // For programmatic navigation

    const handleReportLostClick = () => {
        setShowReportLost(true) // Show ReportLost component
    }

    const handleGoBackClick = () => {
        setShowReportLost(false) // Go back to the SpottedStrayCard
    }

    // If user clicks on a protected route without being authenticated, redirect to login
    const handleProtectedRouteClick = () => {
        if (!isAuthenticated) {
            router.push('/login') // Redirect to login page if not authenticated
        } else {
            router.push('/protected-route') // Replace with your actual protected route
        }
    }

    if (showReportLost) {
        return (
            <div>
                <ReportLost onGoBack={handleGoBackClick} />
            </div>
        )
    }

    return (
        <div className="d-flex justify-content-center mt-5">
            <div
                className="card text-center spotted-stray d-flex flex-column m-2"
                style={{ maxWidth: '1100px' }}
            >
                <div className="card-header h4 text-white">
                    Spotted a stray?
                </div>
                <div className="card-body">
                    <h5 className="card-title">Tell us about it.</h5>
                    <p className="card-text">
                        The Animal Registry relies on your input, please tell
                        any time you encounter a stray.
                        <br />
                        Upload the animal's details (the more detailed the
                        better), an approximate location, as well as an image or
                        a video if applicable.
                    </p>

                    {/* Conditional rendering based on authentication status */}
                    {!isAuthenticated ? (
                        <Link href="/login" className="btn btn-primary">
                            Login
                        </Link>
                    ) : (
                        <button
                            onClick={handleProtectedRouteClick}
                            className="btn btn-primary"
                        >
                            Go to Protected Route
                        </button>
                    )}
                </div>

                <hr className="align-self-center" style={{ width: '90%' }} />

                <div className="card-body">
                    <h5 className="card-title">Report a lost pet</h5>
                    <p className="card-text">
                        We'll keep you updated if any strays have been located
                        nearby that match your pet's features.
                    </p>

                    <button
                        onClick={handleProtectedRouteClick}
                        className="btn btn-primary"
                    >
                        Report a Lost Pet
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SpottedStrayCard
