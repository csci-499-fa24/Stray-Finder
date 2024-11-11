'use client'

import Navbar from "@/app/components/layouts/Navbar/Navbar";
import AnimalReportProfile from "./components/AnimalReportProfile";
import Footer from "@/app/components/layouts/Footer/Footer";
import { useParams } from "next/navigation";
import Matches from "./components/matches";

const StrayDetailsPage = () => {
    const params = useParams();
    const id = params.id;
    return (
        <div>
            <Navbar />
            <AnimalReportProfile id={id} />
            <Matches reportId={id} />
            <Footer />
        </div>
    )
}

export default StrayDetailsPage;