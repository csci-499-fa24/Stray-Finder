import { useState } from 'react'
import Link from 'next/link'
import ReportLost from '../../pages/reportlost/components/ReportLost' // Adjust the path if necessary

const SpottedStrayCard = () => {
    const [showReportLost, setShowReportLost] = useState(false)

    const handleReportLostClick = () => {
        setShowReportLost(true) // Show ReportLost component
    }

    const handleGoBackClick = () => {
        setShowReportLost(false) // Go back to the SpottedStrayCard
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
                    <Link href="/pages/login" className="btn btn-primary">
                        Login
                    </Link>
                </div>
                <hr className="align-self-center" style={{ width: '90%' }} />
                <div className="card-body">
                    <h5 className="card-title">Report a lost pet</h5>
                    <p className="card-text">
                        We'll keep you updated if any strays have been located
                        nearby that match your pet's features.
                    </p>
                    <Link href="/pages/reportlost" className="btn btn-primary">
                        Report a Lost Pet
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SpottedStrayCard
