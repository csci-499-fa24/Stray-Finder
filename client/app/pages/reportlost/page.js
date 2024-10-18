'use client'

import ReportLost from './components/ReportLost'
import Navbar from "@/app/components/layouts/Navbar";
import Footer from "@/app/components/layouts/Footer";

const ReportLostPage = () => {
    return (
        <div>
            <Navbar />
            <ReportLost />
            <Footer />
        </div>
    )
}

export default ReportLostPage
