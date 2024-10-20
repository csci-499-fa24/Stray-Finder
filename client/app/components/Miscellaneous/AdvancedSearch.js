import { useState } from 'react';

const AdvancedSearch = ({ onSearch }) => {
    // State to hold all the search parameters
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [startDate, setStartDate] = useState('');

    // Function to handle the form submission
    const handleSearch = (e) => {
        e.preventDefault(); // Prevent form from refreshing the page

        // Build the search parameters into an object
        const searchParams = {
            species,
            breed,
            city,
            state,
            neighborhood,
            startDate,
        };

        // Callback function to send the search parameters back to the parent component
        onSearch(searchParams);
    };

    return (
        <div className="advanced-search-container d-flex justify-content-center mt-4">
            <form onSubmit={handleSearch} className="advanced-search-form p-4 shadow-sm">
                <h3 className="text-center mb-4">Tell Us More...</h3>
                
                <div className="form-group mb-3">
                    <label>Species</label>
                    <input
                        type="text"
                        className="form-control"
                        value={species}
                        onChange={(e) => setSpecies(e.target.value)}
                        placeholder="e.g. Dog, Cat"
                    />
                </div>

                <div className="form-group mb-3">
                    <label>Breed (Optional)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                        placeholder="e.g. Golden Retriever"
                    />
                </div>

                <div className="form-group mb-3">
                    <label>City</label>
                    <input
                        type="text"
                        className="form-control"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter City"
                    />
                </div>

                <div className="form-group mb-3">
                    <label>State</label>
                    <input
                        type="text"
                        className="form-control"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Enter State"
                    />
                </div>

                <div className="form-group mb-3">
                    <label>Neighborhood (Optional)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Enter Neighborhood"
                    />
                </div>

                <div className="form-group mb-4">
                    <label>Missing After (Start Date)</label>
                    <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary w-100">Search</button>
                </div>
            </form>
        </div>
    );
};

export default AdvancedSearch;
