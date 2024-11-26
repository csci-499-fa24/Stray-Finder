'use client';
import Navbar from '@/app/components/layouts/Navbar/Navbar';
import Footer from '@/app/components/layouts/Footer/Footer';
import Strays from './components/Strays';
import FeaturedStrays from '@/app/components/cards/FeaturedAnimals';
import Map from '@/app/components/map/Map';
import { useState } from 'react';
import './components/Strays.css';

const StraysPage = () => {
    const [activeTab, setActiveTab] = useState('strayRegistry');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div>
            <Navbar />
            <Map />

            <div className="tab-buttons">
                <button
                    className={`tab-button ${activeTab === 'strayRegistry' ? 'active' : ''}`}
                    onClick={() => handleTabClick('strayRegistry')}
                >
                    All Strays
                </button>
                <button
                    className={`tab-button ${activeTab === 'featured' ? 'active' : ''}`}
                    onClick={() => handleTabClick('featured')}
                >
                    Featured Strays
                </button>
            </div>

            <main className="container">
                {activeTab === 'strayRegistry' ? <Strays /> : <FeaturedStrays />}
            </main>

            <Footer />
        </div>
    );
};

export default StraysPage;
