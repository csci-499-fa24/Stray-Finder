import React, { useState, useEffect } from "react";
import styles from "./HelpMatchPopUp.module.css";
import Link from "next/link";
import checkVotingCompletion from "../utils/votingCompletion"; // Import the utility

const HelpMatchPopUp = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [animationIndex, setAnimationIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(true); // New state to control visibility

    const animationData = [
        { image1: "/pet1.jpg", image2: "/pet1.jpg", match: true },
        { image1: "/pet1.jpg", image2: "/pet2.jpg", match: false },
    ];

    useEffect(() => {
        const checkCompletion = async () => {
            const hasUnvotedMatches = await checkVotingCompletion(); // Fetch completion status
            setShowPopup(hasUnvotedMatches); // Show popup only if there are unvoted matches
        };

        checkCompletion();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const animationTimer = setInterval(() => {
            setAnimationIndex((prev) => (prev + 1) % animationData.length);
        }, 2000);

        return () => clearInterval(animationTimer);
    }, []);

    const handleNotNow = () => setIsCollapsed(true);
    const togglePopup = () => setIsCollapsed((prev) => !prev);

    if (!showPopup) return null; // Don't render if there are no unvoted matches

    return (
        <div
            className={`${styles.popupContainer} ${isVisible ? styles.active : ""} ${
                isCollapsed ? styles.collapsed : ""
            }`}
        >
            <div className={styles.arrowSection} onClick={togglePopup}>
                {isCollapsed ? "❮" : "❯"}
            </div>
            <div className={styles.popupContent}>
                {isCollapsed ? null : (
                    <>
                        <div className={styles.animationSection}>
                            <img
                                src={animationData[animationIndex].image1}
                                alt="Pet 1"
                                className={styles.petImage}
                            />
                            <img
                                src={animationData[animationIndex].image2}
                                alt="Pet 2"
                                className={styles.petImage}
                            />
                            <div
                                className={
                                    animationData[animationIndex].match
                                        ? styles.matchIcon
                                        : styles.unmatchIcon
                                }
                            >
                                {animationData[animationIndex].match ? "✔️" : "❌"}
                            </div>
                        </div>
                        <p className={styles.popupText}>🐾 Help us match lost pets? 🐾</p>
                        <div className={styles.buttonGroup}>
                            <Link href="/match">
                                <button className={styles.helpButton}>Sure!</button>
                            </Link>
                            <button className={styles.closeButton} onClick={handleNotNow}>
                                Not Now
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HelpMatchPopUp;
