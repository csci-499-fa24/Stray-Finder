'use client'

import Navbar from "@/app/components/layouts/Navbar/Navbar";
import AnimalReportProfile from "./components/AnimalReportProfile";
import Footer from "@/app/components/layouts/Footer/Footer";
import { useParams } from "next/navigation";

const StrayDetailsPage = () => {
    const params = useParams();
    const id = params.id;
    return (
        <div>
            <Navbar />
            <AnimalReportProfile id={id} />
            <Footer />
        </div>
    )
}

export default StrayDetailsPage;