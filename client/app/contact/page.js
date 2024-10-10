import Navbar from '../components/layouts/Navbar'
import Footer from '../components/layouts/Footer'

const ContactPage = () => {
    return (
      <div>
        <Navbar />
        <h1>How to Contact The Stray Team</h1>
        <p>
            You can contact us at our email:&nbsp;
            <a href="mailto:strayfinder24@gmail.com">strayfinder24@gmail.com</a>.
        </p>
        <Footer />
      </div>
    );
  }
  
  export default ContactPage;