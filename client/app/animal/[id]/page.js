import Navbar from "@/app/components/layouts/Navbar/Navbar";
import ReadMoreById from "./components/ReadMoreById";
import Footer from "@/app/components/layouts/Footer";

const StrayDetailsPage = ({ params }) => {
    const { id } = params;

    return (
        <div>
            <Navbar />
            <ReadMoreById id={id} />
            <Footer />
        </div>
    )
}

export default StrayDetailsPage;