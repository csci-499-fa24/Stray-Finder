'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/app/components/layouts/Navbar/Navbar'
import Footer from '@/app/components/layouts/Footer'
import Matches from '../components/matches'

const SpecificMatchPage = () => {
    const { id } = useParams() // Access the `id` of the specified animal
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)
    const [animalName, setAnimalName] = useState('')

    useEffect(() => {
        if (!id) {
            console.log('ID not found in path params.')
            return
        }

        const fetchSpecificMatches = async () => {
            try {
                console.log(`Fetching report for specified animal ID: ${id}`)

                // Fetch the specific report for the given animal ID
                const specificReportResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report/${id}`
                )
                const specificReportData = await specificReportResponse.json()
                const specificReport = specificReportData.report

                if (!specificReport || !specificReport.animal) {
                    console.log(`No report or animal data found for ID: ${id}`)
                    setLoading(false)
                    return
                }

                setAnimalName(specificReport.animal.name)

                // Fetch all other reports to compare with the specific report
                const allReportsResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report`
                )
                const { reports } = await allReportsResponse.json()

                const matchResults = []

                // Loop through each report and get matches only with the specific report
                for (let report of reports) {
                    if (report._id !== id) {
                        const response = await fetch(
                            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/match`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    report1Id: specificReport._id,
                                    report2Id: report._id,
                                }),
                            }
                        )

                        const { matchScore } = await response.json()
                        matchResults.push({
                            report1: specificReport,
                            report2: report,
                            score: matchScore,
                        })
                    }
                }

                // Sort match results by score in descending order
                matchResults.sort((a, b) => b.score - a.score)
                setMatches(matchResults)
            } catch (error) {
                console.error(`Error fetching matches for report ${id}:`, error)
            } finally {
                setLoading(false)
            }
        }

        fetchSpecificMatches()
    }, [id])

    if (loading) return <div className="spinner-border text-primary" role="status">
    <span className="sr-only"> </span>
  </div>;

    return (
        <div>
            <Navbar />
            <h1 className="text-center p-1">Matches for: {animalName}</h1>
            <Matches matches={matches} /> {/* Pass matches as a prop */}
            <Footer />
        </div>
    )
}

export default SpecificMatchPage
