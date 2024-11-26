import React from 'react';
import './Loader.css'; 

const Loader = () => {
    const loaderStyles = {
        marginTop: '10px',
        fontSize: '1.2rem',
        color: '#555',
        fontWeight: 'bold',
    };

    return (
        <div className="loader-container">
            <div className="running-dog">
                <img src="/loader.webp" alt="Loading..." />
            </div>
            <p style={loaderStyles}>Fetching... Hang tight!</p>
        </div>
    );
};

export default Loader;
