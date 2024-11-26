import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Loader from '../loader/Loader';
import './FoundPetsCarousel.css';

const FoundPetsCarousel = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const imagesToDisplay = 5;
  const isTransitioning = useRef(false);

  // Fetch found pet images on load
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report`);
        const data = await response.json();

        const foundReports = await Promise.all(
          data.reports
            .filter(report => report.reportType === 'Found')
            .map(async (report) => {
              const animalId = report.animal._id ? report.animal._id : report.animal;
              const animalResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal/${animalId}`);
              const animalData = await animalResponse.json();

              if (animalData.animal.imageUrl) {
                return { ...report, animalDetails: animalData.animal };
              }
              return null;
            })
        );

        setReports(foundReports.filter(Boolean));
      } catch (error) {
        console.error('Error fetching found pets:', error);
      } finally {
        setLoading(false); // Set loading to false once fetching is complete
      }
    };

    fetchReports();
  }, []);

  // Auto-advance the carousel if there are 10 or more pets
  useEffect(() => {
    if (reports.length >= 10) {
      const intervalId = setInterval(() => {
        setCurrentPage((prevPage) => prevPage + 1);
      }, 10000);

      return () => clearInterval(intervalId); // Clean up on unmount
    }
  }, [reports.length]);

  // Reset carousel when it loops back to the beginning
  useEffect(() => {
    if (currentPage >= reports.length / imagesToDisplay) {
      // Add delay before resetting to create seamless loop effect
      isTransitioning.current = true;
      setTimeout(() => {
        setCurrentPage(0);
        isTransitioning.current = false;
      }, 0); 
    }
  }, [currentPage, reports.length]);

  // Get visible set of images, ensure only five display
  const visibleReports = reports.slice((currentPage % Math.ceil(reports.length / imagesToDisplay)) * imagesToDisplay, 
                                       ((currentPage % Math.ceil(reports.length / imagesToDisplay)) + 1) * imagesToDisplay);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">
        Thanks to your dedication, these pets have been found 🤎
      </h2>
      <div className="carousel">
        <div className={`carousel-items ${isTransitioning.current ? 'no-transition' : ''}`}>
          {visibleReports.map((report, index) => (
            <div className="carousel-item" key={index}>
              <div className="carousel-image-name-container">
                <div className="carousel-image-container">
                  <img
                    src={report.animalDetails.imageUrl}
                    alt={report.animalDetails.name}
                    className="carousel-image"
                  />
                </div>
                <p className="carousel-name">{report.animalDetails.name}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/FoundPets" className="carousel-link">
          <div className="carousel-arrow">&gt;</div>
        </Link>
      </div>
    </div>
  );
};

export default FoundPetsCarousel;
