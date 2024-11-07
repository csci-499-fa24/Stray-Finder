"use client";
import React, { useEffect } from "react";
import Navbar from "../components/layouts/Navbar/Navbar";
import Footer from "../components/layouts/Footer/Footer";
import styles from "./about.module.css";

export default function AboutPage() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: "-100px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, observerOptions);

    document.querySelectorAll(`.${styles.section}`).forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />

      {/* First Section */}
      <section className={`${styles.section} ${styles.firstSection}`}>
        <div className={`${styles.imageContainer} ${styles.slideRight}`}>
          <img src="/stray1.jpeg" alt="About Us" className={styles.image} />
        </div>
        <div className={`${styles.textContainer} ${styles.slideLeft}`}>
          <h2>About Us</h2>
          <p>
            Welcome to The Stray Registry! We are dedicated to creating a
            platform designed to help lost pets reunite with their owners. Our
            mission is to create a simple and effective way to report and find
            missing pets in your area.
          </p>
          <p>
            Founded in 2024, The Stray Registry emerged from a shared passion
            for animal welfare and the recognition of a critical need in our
            community. Our platform combines user-friendly technology with
            community engagement to create a powerful network for pet recovery.
          </p>
        </div>
      </section>

      {/* Second Section */}
      <section className={`${styles.section} ${styles.reverseSection}`}>
        <div className={`${styles.imageContainer} ${styles.slideLeft}`}>
          <img src="/stray3.avif" alt="Our Vision" className={styles.image} />
        </div>
        <div className={`${styles.textContainer} ${styles.slideRight}`}>
          <h2>Our Vision</h2>
          <p>
            We believe that every pet deserves to be home. Our goal is to assist
            communities in creating a network where lost pets are spotted,
            reported, and reunited with their families quickly and efficiently.
          </p>
          <p>
            Looking ahead, we envision expanding our services through
            partnerships with local animal shelters, veterinary clinics, and pet
            advocacy groups. Together, we can create a comprehensive support
            system for lost pets and their owners.
          </p>
        </div>
      </section>

      {/* Third Section */}
      <section className={styles.section}>
        <div className={`${styles.imageContainer} ${styles.slideRight}`}>
          <img src="/stray8.webp" alt="Our Team" className={styles.image} />
        </div>
        <div className={`${styles.textContainer} ${styles.slideLeft}`}>
          <h2>Our Team</h2>
          <p>
            Our dedicated team consists of six passionate individuals: Raed,
            Rodney, Andy, Alejandro, Nicholas, and Divine - collectively known
            as RRAAND! Each member brings unique skills and experiences to our
            mission.
          </p>
          <p>
            Together, we're working to make The Stray Registry the most
            effective pet recovery platform available, combining our expertise
            in technology and animal welfare to serve our community.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
