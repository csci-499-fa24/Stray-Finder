'use client'
import Navbar from '@/app/components/layouts/Navbar/Navbar'
import Footer from '@/app/components/layouts/Footer/Footer'
import LostPets from './components/lost-pets'
import Matches from '@/app/animal/[id]/components/matches'
import FoundPetsCarousel from '@/app/components/carousel/FoundPetsCarousel'
import HelpMatchPopUp from '@/app/components/HelpMatchPopUp';
import { useState } from 'react'
import './LostPets.css'

const LostPetsPage = () => {
    const [activeTab, setActiveTab] = useState('lostPets')

    const handleTabClick = (tab) => {
        setActiveTab(tab)
    }

    return (
        <div>
            <Navbar />
            {/* Add Carousel at the top of the page */}
            <FoundPetsCarousel />

            <main className="container my-5">
                <div className="tab-buttons">
                    <button
                        className={`tab-button ${
                            activeTab === 'lostPets' ? 'active' : ''
                        }`}
                        onClick={() => handleTabClick('lostPets')}
                    >
                        Lost Pets
                    </button>
                    <button
                        className={`tab-button ${
                            activeTab === 'matches' ? 'active' : ''
                        }`}
                        onClick={() => handleTabClick('matches')}
                    >
                        Matches
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'lostPets' ? <LostPets /> : <Matches />}
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default LostPetsPage
