'use client'
import Navbar from '@/app/components/layouts/Navbar/Navbar';
import Footer from '@/app/components/layouts/Footer/Footer';
import FoundPets from './components/found-pets';
import "./FoundPets.css"

const FoundPage = () => {
    return (
        <div>
            <Navbar />
            <main className="container my-5">
                <FoundPets />
            </main>
            <Footer />
        </div>
    );
};

export default FoundPage;
