import Link from "next/link";
import { GoogleMap, Marker, LoadScriptNext } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import styles from "../AnimalReportProfile.module.css";
import EditAnimalModal from "./EditAnimalModal";
import useAuth from "@/app/hooks/useAuth";
import MessagingInterface from "../../../message/components/MessagingInterface";

const AnimalReportProfile = ({ id }) => {
  const { isAuthenticated, user } = useAuth();
  const [reportProfile, setReportProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 51.505, lng: -0.09 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [showMessagingInterface, setShowMessagingInterface] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report/${id}`
        );
        const data = await response.json();
        setReportProfile(data.report);

        if (data.report && data.report.location.coordinates) {
          setMapCenter({
            lat: data.report.location.coordinates.coordinates[1],
            lng: data.report.location.coordinates.coordinates[0],
          });
        }
      } catch (error) {
        console.error("Error fetching animal data: ", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchReportData();
    }
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.leftSection}>
          <h1 className={styles.cardTitle}>{reportProfile?.animal?.name}</h1>

          <div className={styles.imageWrapper}>
            <img
              src={reportProfile?.animal?.imageUrl}
              className={styles.imageBorder}
              alt={reportProfile?.animal?.name}
            />
          </div>

          <p className={styles.description}>{reportProfile?.description}</p>

          <Link href="/" className={styles.btn}>
            Go Back
          </Link>

          {isAuthenticated && user?._id === reportProfile?.reportedBy._id && (
            <button
              className={`${styles.btn} ${styles.editBtn}`}
              onClick={openModal}
            >
              Edit Animal
            </button>
          )}
        </div>

        <div className={styles.rightSection}>
          <div className={styles.listGroup}>
            <div className={styles.listGroupItem}>
              <span className={styles.label}>Reported By</span>
              <div className={styles.reportedByContent}>
                <Link
                  href={`/profile/${reportProfile?.reportedBy?._id}`}
                  className={styles.reporterLink}
                >
                  {reportProfile?.reportedBy?.username}
                </Link>
                {isAuthenticated &&
                  user?._id !== reportProfile?.reportedBy?._id && (
                    <button
                      className={styles.messageBtn}
                      onClick={() => setShowMessagingInterface(true)}
                    >
                      Message
                    </button>
                  )}
              </div>
            </div>
            <div className={styles.listGroupItem}>
              <span className={styles.label}>Status:</span>
              <span className={styles.statusBadge}>
                {reportProfile?.reportType}
              </span>
            </div>
            <div className={styles.listGroupItem}>
              <span className={styles.label}>Species:</span>
              <span className={styles.value}>
                {reportProfile?.animal?.species}
              </span>
            </div>
            <div className={styles.listGroupItem}>
              <span className={styles.label}>Breed:</span>
              <span className={styles.value}>
                {reportProfile?.animal?.breed || "Unknown"}
              </span>
            </div>
            <div className={styles.listGroupItem}>
              <span className={styles.label}>Color:</span>
              <span className={styles.value}>
                {reportProfile?.animal?.color || "Unknown"}
              </span>
            </div>
            <div className={styles.listGroupItem}>
              <span className={styles.label}>Gender:</span>
              <span className={styles.value}>
                {reportProfile?.animal?.gender}
              </span>
            </div>
            <div className={styles.listGroupItem}>
              <span className={styles.label}>Fixed:</span>
              <span className={styles.value}>
                {reportProfile?.animal?.fixed ? "Yes" : "No"}
              </span>
            </div>
            <div className={styles.listGroupItem}>
              <span className={styles.label}>Collar:</span>
              <span className={styles.value}>
                {reportProfile?.animal?.collar ? "Yes" : "No"}
              </span>
            </div>
            <div className={styles.listGroupItem}>
              <span className={styles.label}>Date Reported:</span>
              <span className={styles.value}>
                {reportProfile?.dateReported
                  ? new Date(reportProfile.dateReported).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      }
                    )
                  : "N/A"}
              </span>
            </div>
          </div>

          {reportProfile?.location?.coordinates && (
            <div className={styles.mapContainer}>
              <LoadScriptNext
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              >
                {mapLoading && (
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only"></span>
                  </div>
                )}
                <GoogleMap
                  mapContainerStyle={{ height: "300px", width: "100%" }}
                  center={mapCenter}
                  zoom={17}
                  onLoad={() => setMapLoading(false)}
                >
                  <Marker position={mapCenter} />
                </GoogleMap>
              </LoadScriptNext>
            </div>
          )}
        </div>
      </div>

      {showMessagingInterface && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <div className={styles.messageContainer}>
              <button
                className={styles.closeButton}
                onClick={() => setShowMessagingInterface(false)}
              >
                X
              </button>
              <MessagingInterface
                recipientId={reportProfile?.reportedBy?._id}
              />
            </div>
          </div>
        </div>
      )}

      <EditAnimalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        reportData={reportProfile}
      />
    </div>
  );
};

export default AnimalReportProfile;
