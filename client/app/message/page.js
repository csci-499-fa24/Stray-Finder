'use client';

import Navbar from "@/app/components/layouts/Navbar/Navbar";
import MessagingInterface from "./components/MessagingInterface";
import Footer from "@/app/components/layouts/Footer/Footer";

const MessagingPage = () => {
    return (
        <div>
            <Navbar />
            <MessagingInterface/>
            <Footer />
        </div>
    )
}

export default MessagingPage;