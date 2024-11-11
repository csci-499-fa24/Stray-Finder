'use client';
import Navbar from '@/app/components/layouts/Navbar/Navbar';
import Footer from '@/app/components/layouts/Footer/Footer';
import MessagingLayout from './messagingLayout';

export default function Page() {
    return (
        <div>
            <Navbar />
            <MessagingLayout />
            <Footer />
        </div>
    );
}
