'use client'

import Navbar from './components/layouts/Navbar'
import Breadcrumb from './components/Miscellaneous/BreadCrumb'
import ReportLost from './components/Miscellaneous/ReportLost'
import FeaturedStrays from './components/cards/FeaturedStrays'
import Footer from './components/layouts/Footer'

export default function Home() {
    return (
        <div>
            <Navbar />
            <Breadcrumb />
            <ReportLost />
            <FeaturedStrays />
            <Footer />
        </div>
    )
}