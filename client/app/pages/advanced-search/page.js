'use client';  // Add this at the very top

import AdvancedSearch from '../../components/Miscellaneous/AdvancedSearch';
import { useState } from 'react';

const AdvancedSearchPage = () => {
    const [animals, setAnimals] = useState([]);

    // Handle search result
    const handleSearch = async (searchParams) => {
        // Simulate an API call to get filtered results
        const query = new URLSearchParams(searchParams).toString();
        const response = await fetch(`/api/animal/search?${query}`);
        const data = await response.json();
        setAnimals(data.animals);
    };

    return (
        <div className="container">
            <h2 className="text-center">Advanced Search</h2>
            <hr />

            {/* Render Advanced Search form */}
            <AdvancedSearch onSearch={handleSearch} />

            {/* Display the filtered results */}
            <div className="row">
                {animals.length > 0 ? (
                    animals.map((animal) => (
                        <div key={animal._id} className="col-md-4">
                            <div className="card">
                                <img src={animal.imageUrl} className="card-img-top" alt={animal.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{animal.name}</h5>
                                    <p className="card-text">{animal.description}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No results found.</p>
                )}
            </div>
        </div>
    );
};

export default AdvancedSearchPage;
