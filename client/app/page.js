// app/page.js
'use client' // This should be at the top

import Navbar from './components/layouts/Navbar'
import Breadcrumb from './components/Miscellaneous/BreadCrumb'
import SpottedStrayCard from './components/cards/SpottedStrayCard'
import FeaturedStrays from './components/cards/FeaturedStrays'
import Footer from './components/layouts/Footer'

export default function Home() {
    return (
        <div>
            <Navbar />
            <Breadcrumb /> {/* Ensure this is used within the page */}
            <SpottedStrayCard />
            <FeaturedStrays />
            <Footer />
        </div>
    )
}