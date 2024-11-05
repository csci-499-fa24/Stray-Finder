'use client'
import Navbar from '@/app/components/layouts/Navbar/Navbar';
import Footer from '@/app/components/layouts/Footer';
import Strays from './components/Strays';

const StraysPage = () => {
    return (
        <div>
            <Navbar />
            <main className="container my-5">
                <Strays />
            </main>
            <Footer />
        </div>
    );
};

export default StraysPage;
