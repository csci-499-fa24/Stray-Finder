// app/page.js
'use client' // This should be at the top

import Navbar from './components/layouts/Navbar/Navbar'
import Breadcrumb from './components/Miscellaneous/BreadCrumb'
import SpottedStrayCard from './components/cards/SpottedStrayCard'
import FeaturedStrays from './components/cards/FeaturedStrays'
import Footer from './components/layouts/Footer'
import Slideshow from './components/layouts/Slideshow/Slideshow'

export default function Home() {
    return (
        <div>
            <Navbar />
            {/*<Breadcrumb />*/}
            <Slideshow />
            <SpottedStrayCard />
            <FeaturedStrays />
            <Footer />
        </div>
    )
}