import React, { useState, useEffect } from "react";
import styles from "./HelpMatchPopUp.module.css";
import Link from "next/link";

const HelpMatchPopUp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);

  const animationData = [
    { image1: "/pet1.jpg", image2: "/pet1.jpg", match: true },
    { image1: "/pet1.jpg", image2: "/pet2.jpg", match: false },
  ];

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
