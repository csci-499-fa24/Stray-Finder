import Navbar from '../components/layouts/Navbar/Navbar'
import Footer from '../components/layouts/Footer/Footer'
import styles from './contact.module.css'; // Import your CSS module
import Slideshow from '../components/layouts/Slideshow/Slideshow'

const ContactPage = () => {
    return (
      <div>
        <Navbar/>
        <div className={styles.contactPage}>
            
            <div className={styles.overlay}>
                <h1 style = {{fontSize: '1.5rem'}}>How to Contact The Stray Team</h1>
                <p>
                    You can contact us at our email:&nbsp;
                    <a href="mailto:strayfinder24@gmail.com">strayfinder24@gmail.com</a>.
                </p>
                {/*<img src="/contact.png" alt="Contact Us" className={styles.aboutImage} />*/}
            </div>
        </div>
        <Footer />
      </div>
    );
}

export default ContactPage;