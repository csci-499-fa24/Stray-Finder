import React from "react";
import "./Slideshow.css";
import Link from "next/link";

const Slideshow = () => {
  return (
    <div
      id="carouselExampleIndicators"
      className="carousel slide"
      data-bs-ride="carousel"
      style={{
        width: "45%",
        margin: "0 auto", // Center the slideshow horizontally
      }}
    >
      {/* <Navbar /> */}
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
          <img src="/stray6.jpeg" className="d-block w-100" alt="First Slide" />
        <div className="carousel-caption d-none d-md-block">
          <h5>Welcome to Stray Finder</h5>
          <p>Helping you reunite with your furry friends!</p>
        <Link href="/about">
          <button className="btn btn-primary">Learn More</button>
        </Link>
    </div>
  </div>
    {/* Slide 2 */}
      <div className="carousel-item">
        <img src="/stray5.webp" className="d-block w-100" alt="Second Slide" />
        <div className="carousel-caption d-none d-md-block">
          <h5>Report a Lost Pet</h5>
          <p>Let others know if you've lost your pet.</p>
        <Link href="/reportAnimal">
          <button className="btn btn-secondary">Report Now</button>
        </Link>
      </div>
  </div>

        {/* Slide 3 */}
        <div className="carousel-item">
          <img src="/stray4.webp" className="d-block w-100" alt="Third Slide" />
          <div className="carousel-caption d-none d-md-block">
            <h5>Found a Stray?</h5>
            <p>Help bring pets home by reporting them.</p>
            <Link href="/FoundPets">
            <button className="btn btn-success">Report Found Pet</button>
            </Link>
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
