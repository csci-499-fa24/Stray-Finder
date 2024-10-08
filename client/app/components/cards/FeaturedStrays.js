import { useEffect, useState } from 'react'
import StrayCard from './StrayCard'

const FeaturedStrays = () => {
    const [animals, setAnimals] = useState([]) // State to hold the fetched animals
    const [loading, setLoading] = useState(true) // State to track loading

    useEffect(() => {
        // Fetch all animals from the backend
        const fetchAnimals = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/spottedstray`
                )
                const data = await response.json()

                // Access the animals from the response
                setAnimals(data.animals || []) // Fallback to empty array if `animals` is undefined
            } catch (error) {
                console.error('Error fetching animals:', error)
            } finally {
                setLoading(false) // Turn off loading once the fetch is complete
            }
        }

        fetchAnimals()
    }, []) // Empty dependency array means this will only run once when the component mounts

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container text-end">
            <div className="text-center h2 p-3">Featured Strays</div>
            <hr />
            <div className="dropdown">
                <a
                    className="btn btn-secondary dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Sort By
                </a>
                <ul className="dropdown-menu">
                    <li>
                        <a className="dropdown-item" href="#">
                            Nearby
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#">
                            Most recent
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#">
                            Filter
                        </a>
                    </li>
                </ul>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 justify-content-center p-2 text-start">
                {animals.length > 0 ? (
                    animals.map((animal) => (
                        <StrayCard
                            key={animal._id}
                            id={animal._id}
                            name={animal.name}
                            image={animal.imageUrl}
                            breed={animal.breed}
                            gender={animal.gender}
                            state="Unknown" // Update this if you have a proper state for animals
                            description={animal.description}
                        />
                    ))
                ) : (
                    <p>No strays found.</p>
                )}
            </div>
        </div>
    )
}

export default FeaturedStrays