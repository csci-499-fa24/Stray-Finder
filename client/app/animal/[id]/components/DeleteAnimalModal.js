import React, { useState } from "react";
import Link from "next/link";
import Modal from "react-modal";
import styles from "../AnimalReportProfile.module.css";

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
      >
        <div className="text-center">
          <h1>Are you sure you want to delete this report?</h1>
        </div>
        <div
          className="d-flex justify-content-between"
          style={{ height: "75px" }}
        >
          <Link
            onClick={handleDelete}
            className="btn btn-danger mt-auto"
            disabled={loading}
            href="/"
          >
            {loading ? "Deleteing..." : "Delete"}
          </Link>
          <button className="btn btn-secondary mt-auto" onClick={onClose}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteAnimalModal;
