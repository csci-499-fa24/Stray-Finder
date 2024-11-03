'use client'
import Matches from './components/matches'
import Navbar from '@/app/components/layouts/Navbar/Navbar'
import Footer from '@/app/components/layouts/Footer'
import { useEffect, useState } from 'react';

const AllMatchesPage = () => {
const [matches, setMatches] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
    const fetchMatches = async () => {
        try {
            const reportResponse = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report`
            )
            const { reports } = await reportResponse.json()

            const matchResults = []
            for (let i = 0; i < reports.length; i++) {
                for (let j = i + 1; j < reports.length; j++) {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/match`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                report1: reports[i],
                                report2: reports[j],
                            }),
                        }
                    )

                    const { matchScore } = await response.json()
                    matchResults.push({
                        report1: reports[i],
                        report2: reports[j],
                        score: matchScore,
                    })
                }
            }

            matchResults.sort((a, b) => b.score - a.score)
            setMatches(matchResults)
        } catch (error) {
            console.error('Error fetching matches:', error)
        } finally {
            setLoading(false)
        }
    }

    fetchMatches()
}, [])

    if (loading) return <p>Loading matches...</p>;

    return (
        <div>
            <Navbar />
            <h1 className="text-center mb-4">All Matches</h1>
            <Matches matches={matches} />
            <Footer />
        </div>
    )
};

export default AllMatchesPage;
