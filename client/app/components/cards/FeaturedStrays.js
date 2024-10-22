import { useEffect, useState, memo } from 'react'
import StrayCard from './StrayCard'

const FeaturedStrays = () => {
    const [animals, setAnimals] = useState([]) // State to hold the fetched animals
    const [loading, setLoading] = useState(false) // State to track loading
    const [filters, setFilters] = useState({
        species: '',
        gender: '',
        name: '',
    }) // State to store selected filters
    const [debouncedFilters, setDebouncedFilters] = useState(filters) // Debounced state for filtering

    // Debounce the filters so the API is not called on every keypress or select
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters)
        }, 500) // Wait 500ms after the user stops typing/selecting before applying filters

        return () => {
            clearTimeout(handler)
        }
    }, [filters]) // Run this effect whenever filters change

    useEffect(() => {
        // Fetch animals from the backend with filters applied
        const fetchAnimals = async () => {
            setLoading(true)
            try {
                const queryParams = new URLSearchParams(
                    Object.fromEntries(
                        Object.entries(debouncedFilters).filter(
                            ([_, value]) => value
                        ) // Only include non-empty filters
                    )
                )
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal?${queryParams}`
                )
                const data = await response.json()
                setAnimals(data.animals || []) // Fallback to empty array if `animals` is undefined
            } catch (error) {
                console.error('Error fetching animals:', error)
            } finally {
                setLoading(false) // Turn off loading once the fetch is complete
            }
        }

        fetchAnimals()
    }, [debouncedFilters]) // Run the effect when debounced filters change

    const handleFilterChange = (event) => {
        const { name, value } = event.target
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }))
    }

    return (
        <div className="container text-end">
            <div className="text-center h2 p-3">Featured Strays</div>
            <hr />

            {/* Render the filters */}
            <MemoizedFilters
                filters={filters}
                handleFilterChange={handleFilterChange}
            />

            <AnimalList animals={animals} loading={loading} />
        </div>
    )
}

const Filters = ({ filters, handleFilterChange }) => {
    return (
        <div className="dropdown mb-3">
            <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                Filter By
            </button>
            <ul
                className="dropdown-menu p-3"
                aria-labelledby="dropdownMenuButton"
            >
                {/* Filter by Species */}
                <li className="mb-2">
                    <label htmlFor="species">Species:</label>
                    <select
                        id="species"
                        name="species"
                        value={filters.species}
                        onChange={handleFilterChange}
                        className="form-select"
                    >
                        <option value="">Any</option>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                    </select>
                </li>

                {/* Filter by Gender */}
                <li className="mb-2">
                    <label htmlFor="gender">Gender:</label>
                    <select
                        id="gender"
                        name="gender"
                        value={filters.gender}
                        onChange={handleFilterChange}
                        className="form-select"
                    >
                        <option value="">Any</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </li>

                {/* Filter by Name */}
                <li className="mb-2">
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        name="name"
                        value={filters.name}
                        type="text"
                        placeholder="Enter name"
                        onChange={handleFilterChange}
                        className="form-control"
                    />
                </li>
            </ul>
        </div>
    )
}

// Memoize the filters to avoid unnecessary re-renders
const MemoizedFilters = memo(Filters)

const AnimalList = ({ animals, loading }) => {
    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 justify-content-center p-2 text-start">
            {animals.length > 0 ? (
                animals.map((animal) => (
                    <StrayCard
                        key={animal._id}
                        id={animal._id}
                        name={animal.name}
                        image={animal.imageUrl}
                        species={animal.species}
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
    )
}

export default FeaturedStrays
