"use client";
import { useState, useEffect } from "react";
import Link from "next/link"; // Import Link for navigation
import Navbar from '../layouts/Navbar/Navbar';
import Footer from "../layouts/Footer/Footer";
import "./home.css";

const backgroundImages = [
  "/background-stray.jpg",
  "/background-stray2.jpg",
  "/background-stray5.jpg",
  "/background-stray7.jpg",
  "/background-stray8.jpg",
  "/backgrounds-stray9.jpg",
  "/background-stray10.jpg",
  "/backgrounds-stray11.jpg"
];

const HomeTest = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homeTest">
      <Navbar />

      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`
        }}
      >
        <h1>Reuniting Pets with People</h1>
        <p>Find lost pets or report sightings to bring pets back home.</p>
        <div className="cta-buttons">
          <Link href="/Strays">
            <button className="cta-button">Find a Stray</button>
          </Link>
          <Link href="/reportAnimal">
            <button className="cta-button">Report a Sighting</button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomeTest;
