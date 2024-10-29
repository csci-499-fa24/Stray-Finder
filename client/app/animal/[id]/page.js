import Navbar from "@/app/components/layouts/Navbar/Navbar";
import AnimalReportProfile from "./components/AnimalReportProfile";
import Footer from "@/app/components/layouts/Footer";

const StrayDetailsPage = async ({ params }) => {
    const { id } = await params;

    return (
        <div>
            <Navbar />
            <AnimalReportProfile id={id} />
            <Footer />
        </div>
    )
}

export default StrayDetailsPage;