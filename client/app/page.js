// app/page.js
'use client' // This should be at the top

import Navbar from './components/layouts/Navbar/Navbar'
import Breadcrumb from './components/Miscellaneous/BreadCrumb'
import Map from './components/Miscellaneous/Map'
import SpottedStrayCard from './components/cards/SpottedStrayCard'
import FeaturedStrays from './components/cards/FeaturedAnimals'
import Footer from './components/layouts/Footer'
import Slideshow from './components/layouts/Slideshow/Slideshow'

export default function Home() {
    return (
        <div>
            <Navbar />
            {/*<Breadcrumb />*/}
            <Slideshow />
            <Map />
            <SpottedStrayCard />
            <FeaturedStrays />
            <Footer />
        </div>
    )
}