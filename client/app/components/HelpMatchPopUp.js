"use client";

import React, { useState, useEffect } from "react";
import styles from "./HelpMatchPopUp.module.css";
import Link from "next/link";

const HelpMatchPopUp = () => {
  const [isVisible, setIsVisible] = useState(false); // Handles visibility
  const [isCollapsed, setIsCollapsed] = useState(false); // Handles collapse/expand

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true); // Show the popup after 2 seconds
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNotNow = () => {
    setIsCollapsed(true); // Collapse the popup
  };

  const togglePopup = () => {
    setIsCollapsed((prev) => !prev); // Toggle collapsed/expanded
  };

  return (
    <div
      className={`${styles.popupContainer} ${isVisible ? styles.active : ""} ${
        isCollapsed ? styles.collapsed : ""
      }`}
    >
      {/* Arrow Section ❮ ❯*/}
      <div className={styles.arrowSection} onClick={togglePopup}>
        {isCollapsed ? "❮" : "❯"}
      </div>
      <div className={styles.popupContent}>
        <p className={styles.popupText}>
          🐾 Help us match lost pets? 🐾
        </p>
        <div className={styles.buttonGroup}>
          <Link href="/match">
            <button className={styles.helpButton}>Sure!</button>
          </Link>
          <button className={styles.closeButton} onClick={handleNotNow}>
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpMatchPopUp;
