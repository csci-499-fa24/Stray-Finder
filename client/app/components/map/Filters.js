import React from 'react';
import {
    dogBreeds,
    catBreeds,
    rabbitBreeds,
    hamsterBreeds,
    guineaPigBreeds,
    lizardBreeds,
    pigBreeds,
    birdBreeds,
    ferretBreeds,
} from './Constants';

const Filters = ({ filters, setFilters, setRadius, radius }) => {
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const breedOptions =
        filters.species === 'Dog'
            ? dogBreeds
            : filters.species === 'Cat'
            ? catBreeds
            : filters.species === 'Rabbit'
            ? rabbitBreeds
            : filters.species === 'Hamster'
            ? hamsterBreeds
            : filters.species === 'Guinea Pig'
            ? guineaPigBreeds
            : filters.species === 'Lizard'
            ? lizardBreeds
            : filters.species === 'Pig'
            ? pigBreeds
            : filters.species === 'Bird'
            ? birdBreeds
            : filters.species === 'Ferret'
            ? ferretBreeds
            : [];

    return (
        <div className="filter-container">
            <h3>Filter Reports</h3>
            
            {/* Gender Filter */}
            <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="filter-dropdown"
            >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>

            {/* Species Filter */}
            <select
                name="species"
                value={filters.species}
                onChange={handleFilterChange}
                className="filter-dropdown"
            >
                <option value="">All Species</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Hamster">Hamster</option>
                <option value="Guinea Pig">Guinea Pig</option>
                <option value="Lizard">Lizard</option>
                <option value="Pig">Pig</option>
                <option value="Bird">Bird</option>
                <option value="Ferret">Ferret</option>
            </select>

            {/* Breed Filter - Shown only if species is selected */}
            {filters.species && (
                <select
                    name="breed"
                    value={filters.breed}
                    onChange={handleFilterChange}
                    className="filter-dropdown"
                >
                    <option value="">All Breeds</option>
                    {breedOptions.map((breed) => (
                        <option key={breed} value={breed}>
                            {breed}
                        </option>
                    ))}
                </select>
            )}

            {/* Report Type Filter */}
            <select
                name="reportType"
                value={filters.reportType}
                onChange={handleFilterChange}
                className="filter-dropdown"
            >
                <option value="">All Reports</option>
                <option value="Stray">Stray</option>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
            </select>

            {/* Fixed Status Filter */}
            <select
                name="fixed"
                value={filters.fixed}
                onChange={handleFilterChange}
                className="filter-dropdown"
            >
                <option value="">Fixed Status</option>
                <option value="Yes">Fixed</option>
                <option value="No">Not Fixed</option>
            </select>

            {/* Collar Status Filter */}
            <select
                name="collar"
                value={filters.collar}
                onChange={handleFilterChange}
                className="filter-dropdown"
            >
                <option value="">Collar Status</option>
                <option value="true">With Collar</option>
                <option value="false">Without Collar</option>
            </select>

            {/* Time Filter */}
            <select
                name="last24Hours"
                value={filters.last24Hours || ''}
                onChange={(e) =>
                    setFilters((prevFilters) => ({
                        ...prevFilters,
                        last24Hours: e.target.value === 'true', // Convert string to boolean
                    }))
                }
                className="filter-dropdown"
            >
                <option value="">Reported Time</option>
                <option value="true">Last 24 Hours</option>
                <option value="false">Any Time</option>
            </select>


            {/* Radius Filter */}
            <label htmlFor="radius">Search Radius</label>
            <input
                type="range"
                min="1"
                max="100"
                step=".25"
                value={radius || 10}
                onChange={(e) => setRadius(e.target.value)}
                className="radius-slider"
            />
            <p>{radius} miles radius</p>
        </div>
    );
};

export default Filters;
