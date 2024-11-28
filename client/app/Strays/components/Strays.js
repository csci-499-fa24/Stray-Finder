import { useEffect, useState, memo } from 'react'
import Loader from '../../components/loader/Loader';
import AnimalCard from '../../components/cards/AnimalCard';
import { FaInfoCircle } from 'react-icons/fa'; 
import Modal from '../../components/infoModal/Modal';
import './Strays.css';

const Strays = () => {
    const [reports, setReports] = useState([]) // State to hold the fetched animals
    const [loading, setLoading] = useState(false) // State to track loading
    const [filters, setFilters] = useState({
        species: '',
        gender: '',
        name: '',
    }) // State to store selected filters
    const [debouncedFilters, setDebouncedFilters] = useState(filters)
    const [showInfo, setShowInfo] = useState(false);

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
        const fetchReports = async () => {
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
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report?${queryParams}`
                )
                const data = await response.json()

                const filteredReports = data.reports.filter((report) => {
                    const { species, gender, name } = debouncedFilters;
                    const animal = report.animal;

                    return (
                        (!species || animal.species === species) &&
                        (!gender || animal.gender) &&
                        (!name || animal.name.toLowerCase().includes(name.toLowerCase()))
                    );
                });


                setReports(filteredReports || []) // Fallback to empty array if `animals` is undefined
            } catch (error) {
                console.error('Error fetching reports:', error)
            } finally {
                setLoading(false) // Turn off loading once the fetch is complete
            }
        }

        fetchReports()
    }, [debouncedFilters]) // Run the effect when debounced filters change

    const handleFilterChange = (event) => {
        const { name, value } = event.target
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }))
    }

    const handleInfoClick = () => {
        setShowInfo(true); // Show the modal
    };

    const handleCloseInfo = () => {
        setShowInfo(false); // Close the modal
    };

    return (
        <div className="container text-end">
            <div className="strays-header">
                <div className="strays-info-icon-container">
                    <FaInfoCircle
                        className="strays-info-icon"
                        onClick={handleInfoClick}
                        title="Click for more info"
                    />
                </div>

                {/* Render the filters */}
                <MemoizedFilters
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                />
            </div>

            {loading ? <Loader /> : <ReportList reports={reports} />}

            {showInfo && (
                <Modal onClose={handleCloseInfo}>
                    <h2>About This Page</h2>
                    <p>
                        This page lists pets that have been seen by users but do not belong to the user posting it.
                        Click the <strong>Read More</strong> button on each post to view detailed information, including:
                    </p>
                    <ul>
                        <li>Where the pet was last seen (on a map).</li>
                        <li>Other details about the pet like species, breed, color, and gender.</li>
                        <li>As well as contact the post owner by clicking the message button.</li>
                    </ul>
                    <p>
                        Users can only contact the post owner if logged in. Messaging helps determine whether the owner has seen the pet or currently has it in their possession.
                    </p>
                </Modal>
            )}
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
                        <option value="Rabbit">Rabbit</option>
                        <option value="Hamster">Hamster</option>
                        <option value="Guinea Pig">Guinea Pig</option>
                        <option value="Lizard">Lizard</option>
                        <option value="Pig">Pig</option>
                        <option value="Ferret">Ferret</option>
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

const ReportList = ({ reports, loading }) => {
    if (loading) {
        return <Loader />;
    }

    const strayReports = reports.filter(report => report?.reportType === 'Stray')
    return (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 justify-content-center p-2 text-start">
            {strayReports.length > 0 ? (
                strayReports.map((report) => (
                    <AnimalCard
                        key={report?.animal?._id}
                        report_id={report?._id}
                        animal_id={report?.animal?._id}
                        name={report?.animal?.name}
                        username={report?.reportedBy?.username}
                        image={report?.animal?.imageUrl}
                        species={report?.animal?.species}
                        gender={report?.animal?.gender}
                        state={report.reportType}
                        description={report?.animal?.description}
                    />
                ))
            ) : (
                <p>No strays found.</p>
            )}
        </div>
    )
}

export default Strays;
