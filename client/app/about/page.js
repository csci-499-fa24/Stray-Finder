'use client'

import Navbar from '../components/layouts/Navbar/Navbar'
import Footer from '../components/layouts/Footer'
import styles from './about.module.css'; // Import your CSS module

const About = () => {
    return (
        <div>
            <Navbar />
            <div className={styles.aboutContent}>
                <h1>About Us</h1>
                <p>Welcome to The Stray Registry! We are dedicated to a platform designed to help lost pets reunite with their owners. Our mission is to create a simple and effective way to report and find missing pets in your area. </p>
                <p>If you've lost a pet or found a stray, feel free to use our platform to submit a report. Together, we can help bring pets back home.</p>
                <h2>Our Vision </h2>
                <p>We believe that every pet deserves to be home. Our goal is to assist communities in creating a network where lost pets are spotted, reported, and reunited with their families. </p>
                <h2>Our Team </h2> 
                <p> Raed, Rodney, Andy, Alejandro, Nicholas and Divine! Also known as RRAAND!
                </p>
                <img src="/saddog.png" alt="About Us" className={styles.aboutImage} />
                {/* Add more content here */}
            </div>
            <Footer />
        </div>
    )
}

export default About
