import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./DeleteAnimalProfile.module.css";

const DeleteAnimalModal = ({ isOpen, onClose, report_id, animal_id }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response1 = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal/${animal_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const response2 = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/animal-report/${report_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response1.ok || !response2.ok) {
        throw new Error("Failed to delete animal or animal report");
      }
    } catch (error) {
      console.error("Error deleting animal or animal report data: ", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Delete Prompt"
        className={styles.customModal}
        ariaHideApp={false}
        style={{
          overlay: { zIndex: 18 },
          content: { zIndex: 19 },
        }}
      >
        <div className={`${styles.modalContent}`}>
          <h1 className={styles.modalTitle}>
            Are you sure you want to delete this report?
          </h1>
          <div className={styles.modalButtons}>
            <button
              onClick={handleDelete}
              className={`${styles.deleteButton} btn btn-danger`}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
            <button
              className={`${styles.cancelButton} btn btn-secondary`}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteAnimalModal;