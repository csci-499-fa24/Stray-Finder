import Navbar from '../components/layouts/Navbar'
import Footer from '../components/layouts/Footer'

const AboutPage = () => {
    return (
      <div>
        <Navbar />
        <h1>About The Stray Registry</h1>
        <p>
            Welcome to The Stray Registry, a platform designed to help lost pets reunite with their owners. 
            Our mission is to create a simple and effective way to report and find missing pets in your area.
        </p>
        <p>
            If you've lost a pet or found a stray, feel free to use our platform to submit a report. 
            Together, we can help bring pets back home.
        </p>
        <h2>Our Vision</h2>
        <p>
            We believe that every pet deserves to be home. Our goal is to assist communities in creating a network 
            where lost pets are spotted, reported, and reunited with their families.
        </p>
        <Footer />
      </div>
    );
  }
  
  export default AboutPage;