import React from 'react';

// Ensure Bootstrap CSS is imported
import 'bootstrap/dist/css/bootstrap.min.css';


//import stray1 from 'images/stray1.jpeg';  // Import your images
//import stray2 from '../images/stray2.jpeg';
//import stray3 from '../images/stray3.jpeg';

/*<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>*/


const Slideshow = () => {
  return (
    <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
      {/* Indicators */}
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>

      {/* Slideshow content */}
      <div className="carousel-inner">
        {/* Slide 1 */}
        <div className="carousel-item active">
          <img src="./images/stray1.jpeg" className="d-block w-100" alt="First Slide" />
          <div className="carousel-caption d-none d-md-block">
            <h5>Welcome to Stray Finder</h5>
            <p>Helping you reunite with your furry friends!</p>
            <button className="btn btn-primary">Learn More</button>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="carousel-item">
          <img src="your-image2.jpg" className="d-block w-100" alt="Second Slide" />
          <div className="carousel-caption d-none d-md-block">
            <h5>Report a Lost Pet</h5>
            <p>Let others know if you've lost your pet.</p>
            <button className="btn btn-secondary">Report Now</button>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="carousel-item">
          <img src="your-image3.jpg" className="d-block w-100" alt="Third Slide" />
          <div className="carousel-caption d-none d-md-block">
            <h5>Found a Stray?</h5>
            <p>Help bring pets home by reporting them.</p>
            <button className="btn btn-success">Report Found Pet</button>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Slideshow;
