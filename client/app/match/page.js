'use client';

import Navbar from "@/app/components/layouts/Navbar/Navbar";
import MatchVote from "./components/MatchVote";
import 'bootstrap/dist/css/bootstrap.min.css';
const MatchPage = () => {
    return (
        <div>
            <Navbar />
            <MatchVote />
        </div>
    );
}

export default MatchPage;