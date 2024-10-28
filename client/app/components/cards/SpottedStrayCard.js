import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useAuth from '@/app/hooks/useAuth'

const SpottedStrayCard = () => {
    const { isAuthenticated } = useAuth() // Get authentication status
    const [authChecked, setAuthChecked] = useState(null) // Set initially to null to block rendering until determined
    const router = useRouter()

    // Handle when to show loading and when to show buttons based on authentication status
    useEffect(() => {
        if (isAuthenticated !== undefined) {
            setAuthChecked(isAuthenticated) // Set authChecked to either true or false once status is determined
        }
    }, [isAuthenticated])

    const handleReportLostClick = () => {
        router.push('/reportAnimal') // Redirect to the reportAnimal page
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

                    {/* Conditional rendering for the buttons based on authentication status */}
                    {authChecked === null ? (
                        <div className="d-flex justify-content-center">
                            <p>Loading...</p>
                        </div>
                    ) : !authChecked ? (
                        <Link href="/auth" className="btn btn-primary">
                            Login
                        </Link>
                    ) : (
                        <button
                            onClick={handleReportLostClick}
                            className="btn btn-primary"
                        >
                            Report a Stray
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

                    {/* Conditional rendering for 'Report a Lost Pet' button */}
                    {authChecked === null ? (
                        <div className="d-flex justify-content-center">
                            <p>Loading...</p>
                        </div>
                    ) : authChecked ? (
                        <button
                            onClick={handleReportLostClick}
                            className="btn btn-primary"
                        >
                            Report a Lost Pet
                        </button>
                    ) : (
                        <Link href="/auth" className="btn btn-primary">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SpottedStrayCard
