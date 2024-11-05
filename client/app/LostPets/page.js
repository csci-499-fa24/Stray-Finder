'use client'
import Navbar from '@/app/components/layouts/Navbar/Navbar';
import Footer from '@/app/components/layouts/Footer';
import LostPets from './components/lost-pets';

const LostPetsPage = () => {
    return (
        <div>
            <Navbar />
            <main className="container my-5">
                <LostPets />
            </main>
            <Footer />
        </div>
    );
};

export default LostPetsPage;
