'use client'

import Navbar from '../components/layouts/Navbar'
import Footer from '../components/layouts/Footer'
import styles from './contact.module.css'; // Import your CSS module

const Contact = () => {
    return (
        <div>
            <Navbar />
            <div className={styles.aboutContent}>
                <h1>Contact</h1>
                <p>Contact us! </p>
                <p>Our email is strayfinder24@gmail.com </p>
                <img src="/contact.png" alt="About Us" className={styles.aboutImage} />
                {/* Add more content here */}
            </div>
            <Footer />
        </div>
    )
}

export default Contact