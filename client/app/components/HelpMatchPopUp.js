import React, { useState, useEffect } from "react";
import styles from "./HelpMatchPopUp.module.css";
import Link from "next/link";
import Modal from "./infoModal/Modal";
import checkVotingCompletion from "../utils/votingCompletion";

const HelpMatchPopUp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

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
  const handleInfoClick = () => setShowInfo(true); 
  const handleCloseInfo = () => setShowInfo(false); 

  if (!showPopup) return null;

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
            <p className={styles.whyLink} onClick={handleInfoClick}>
              Why?
            </p>
          </>
        )}
      </div>
      {/* Modal for additional information */}
      {showInfo && (
        <Modal onClose={handleCloseInfo}>
          <h2>Why Match Votes?</h2>
          <p>
            We ask for your help because our current system relies on details
            like descriptions, species, and location to suggest potential matches. While effective, it's not perfect:
          </p>
          <ul>
            <li>
              Descriptions and breeds can vary widely, leading to misalignment.
            </li>
            <li>
              Locations are approximate, and pets often travel far from where
              they were lost or found.
            </li>
            <li>
              Small but critical differences (e.g., unique markings) are
              something only human judgment can validate.
            </li>
          </ul>
          <p>
            By casting your vote, you’re not just refining our matches—you’re completing the last, 
            vital step in reuniting pets with their families.
            Ensuring we notify owners only when there’s real potential for a
            meaningful connection. <strong> You are the missing piece. 🐾 </strong>
          </p>
        </Modal>
      )}
    </div>
  );
};

export default HelpMatchPopUp;
