// app/page.js
'use client' // This should be at the top

import Navbar from './components/layouts/Navbar/Navbar'
import Breadcrumb from './components/Miscellaneous/BreadCrumb'
import Map from './components/Miscellaneous/Map'
import SpottedStrayCard from './components/cards/SpottedStrayCard'
import FeaturedStrays from './components/cards/FeaturedAnimals'
import Footer from './components/layouts/Footer'
import Slideshow from './components/layouts/Slideshow/Slideshow'
import { generateToken } from './notifications/firebase'
import { useEffect } from 'react'
import { onMessage } from 'firebase/messaging'
import { messaging } from './notifications/firebase'
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
    useEffect(() => {
        generateToken();
        onMessage(messaging, (payload) => {
            console.log("New report notification received: ", payload);
            if (payload.notification) {
                toast.info(payload.notification.body || "New animal report submitted!", {
                    position: 'top-right',
                    duration: 10000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                });
            } else {
                console.error("Notification data is missing", payload);
            }
        });
    }, []);
   
    return (
        <div>
            <Navbar />
            {/*<Breadcrumb />*/}
            <Slideshow />
            <Map />
            <SpottedStrayCard />
            <Toaster position='top-right' />
            <FeaturedStrays />
            <Footer />
        </div>
    )
}