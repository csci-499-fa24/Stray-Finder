import { useState, useEffect } from 'react'
import AnimalCard from '@/app/components/cards/AnimalCard'

const Matches = ({ reportId }) => {
    const [targetReport, setTargetReport] = useState(null) // Store the target report
    const [allMatches, setAllMatches] = useState([]) // Store all matches
    const [displayedMatches, setDisplayedMatches] = useState([]) // Matches currently displayed
    const [page, setPage] = useState(1) // Track pages for local pagination
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState('both') // Default filter to 'both'

    const limit = 20 // Number of items to show per page

    const loadMatches = async () => {
        setIsLoading(true)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/match/${reportId}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            )

            if (!response.ok) {
                console.error('Failed to load matches:', response.statusText)
                return
            }

            const data = await response.json()
            console.log('API Response:', data); // Log the response to verify `reportedBy.username`
            console.log('Fetched matches:', data.matches)

            if (data.targetReport && data.matches.length > 0) {
                setTargetReport(data.targetReport) // Set the target report

                // Filter matches based on the selected filter
                const filteredMatches = data.matches.filter((match) => {
                    const isStray = match.report.reportType === 'Stray'
                    const isLost = match.report.reportType === 'Lost'
                    if (filter === 'stray') return isStray
                    if (filter === 'lost') return isLost
                    return true // Show all if 'both' is selected
                })

                // Sort matches by score in descending order
                const sortedMatches = filteredMatches.sort(
                    (a, b) => b.score - a.score
                )
                setAllMatches(sortedMatches)

                // Show the first batch
                setDisplayedMatches(sortedMatches.slice(0, limit))
                setPage(1) // Reset page for display
            } else {
                setDisplayedMatches([])
            }
        } catch (error) {
            console.error('Error loading matches:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadMore = () => {
        const nextPage = page + 1
        const newDisplayedMatches = allMatches.slice(0, nextPage * limit)
        setDisplayedMatches(newDisplayedMatches)
        setPage(nextPage)
    }

    useEffect(() => {
        loadMatches()
    }, [filter])

    return (
        <div className="container my-4">
            <h3 className="text-center mb-4">Matching Results</h3>

            {/* Filter Dropdown */}
            <div className="text-center mb-4">
                <label htmlFor="filterSelect" className="form-label me-2">
                    Filter by Type:
                </label>
                <select
                    id="filterSelect"
                    className="form-select d-inline-block w-auto"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="stray">Only Stray</option>
                    <option value="lost">Only Lost</option>
                    <option value="both">Both</option>
                </select>
            </div>

            <div className="row justify-content-center">
                {displayedMatches.length > 0 && targetReport ? (
                    displayedMatches.map(({ report, score }, index) => (
                        <div key={index} className="col-12 col-lg-10 mb-4">
                            <div className="card shadow-sm p-3">
                                <div className="row align-items-center">
                                    {/* Target Report Card */}
                                    <div className="col-md-5">
                                        <AnimalCard
                                            report_id={targetReport._id}
                                            animal_id={targetReport.animal._id}
                                            name={targetReport.animal.name}
                                            username={targetReport.reportedBy?.username}
                                            image={targetReport.animal.imageUrl}
                                            species={
                                                targetReport.animal.species
                                            }
                                            gender={targetReport.animal.gender}
                                            state={
                                                targetReport.location?.address
                                            }
                                            description={
                                                targetReport.description
                                            }
                                        />
                                    </div>
                                    {/* Match Score */}
                                    <div className="col-md-2 text-center">
                                        <h2 className="mb-0 font-weight-bold">
                                            {Math.round(score * 100)}%
                                        </h2>
                                        <p className="text-muted">
                                            Match Score
                                        </p>
                                    </div>
                                    {/* Matched Report Card */}
                                    <div className="col-md-5">
                                        <AnimalCard
                                            report_id={report._id}
                                            animal_id={report.animal._id}
                                            name={report.animal.name}
                                            username={report.reportedBy?.username}
                                            image={report.animal.imageUrl}
                                            species={report.animal.species}
                                            gender={report.animal.gender}
                                            state={report.location?.address}
                                            description={report.description}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No matches found.</p>
                )}
            </div>

            {displayedMatches.length < allMatches.length && (
                <div className="text-center my-4">
                    <button
                        onClick={loadMore}
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default Matches
