import { useEffect, useState, memo } from 'react';
import Loader from '../../components/loader/Loader';
import AnimalCard from '../../components/cards/AnimalCard';

const LostPets = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        species: '',
        gender: '',
        name: '',
    });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 500);
        return () => {
            clearTimeout(handler);
        };
    }, [filters]);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams(
                    Object.fromEntries(
                        Object.entries(debouncedFilters).filter(
                            ([_, value]) => value
                        )
                    )
                );
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report?${queryParams}`
                );
                const data = await response.json();
                const filteredReports = data.reports.filter(report => report.reportType === 'Lost');

                setReports(filteredReports || []);
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [debouncedFilters]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    return (
        <div className="container text-end">
            <MemoizedFilters filters={filters} handleFilterChange={handleFilterChange} />
            {loading ? <Loader /> : <ReportList reports={reports} />}
        </div>
    );
};

const Filters = ({ filters, handleFilterChange }) => {
    return (
        <div className="dropdown mb-3">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                Filter By
            </button>
            <ul className="dropdown-menu p-3" aria-labelledby="dropdownMenuButton">
                {/* Filter by Species */}
                <li className="mb-2">
                    <label htmlFor="species">Species:</label>
                    <select id="species" name="species" value={filters.species} onChange={handleFilterChange} className="form-select">
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
                    <select id="gender" name="gender" value={filters.gender} onChange={handleFilterChange} className="form-select">
                        <option value="">Any</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </li>

                {/* Filter by Name */}
                <li className="mb-2">
                    <label htmlFor="name">Name:</label>
                    <input id="name" name="name" value={filters.name} type="text" placeholder="Enter name" onChange={handleFilterChange} className="form-control" />
                </li>
            </ul>
        </div>
    );
};

const MemoizedFilters = memo(Filters);

const ReportList = ({ reports, loading }) => {
    if (loading) {
        return <Loader />;
    }

    return (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 justify-content-center p-2 text-start">
            {reports.length > 0 ? (
                reports.map(report => (
                    <AnimalCard
                        key={report.animal._id}
                        report_id={report._id}
                        animal_id={report.animal._id}
                        name={report.animal.name}
                        username={report.reportedBy.username}
                        image={report.animal.imageUrl}
                        species={report.animal.species}
                        gender={report.animal.gender}
                        state={report.reportType} // Update this if you have a proper state for animals
                        description={report.animal.description}
                    />
                ))
            ) : (
                <p>No lost pets found.</p>
            )}
        </div>
    );
};

export default LostPets;
