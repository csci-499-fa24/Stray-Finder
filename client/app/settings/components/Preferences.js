"use client";

import { useState } from "react";
import styles from "./Preferences.module.css"; // Import CSS for styling

const Preferences = ({ isOpen, onClose, user }) => {
    const [notificationPreference, setNotificationPreference] = useState(user?.notificationPreference || "immediate");
    const [isSubmitting, setIsSubmitting] = useState(false); // To handle button disabling during submission

    const handleSave = async () => {
        setIsSubmitting(true); // Disable button during submission
        try {
            // Set up the request options
            const requestOptions = {
                method: "POST",
                body: JSON.stringify({ notificationPreference }),
                headers: {
                    "Content-Type": "application/json", // Specify JSON content type
                },
                credentials: "include", // Include cookies for authentication
            };

            // Send the POST request
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/preferences`, requestOptions);

            // Check response
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData);
                throw new Error("Failed to update preferences");
            }

            const data = await response.json(); // Parse the response JSON
            console.log("Response:", data);
            alert("Preferences updated successfully!");
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error updating preferences:", error);
            alert("Something went wrong while saving preferences.");
        } finally {
            setIsSubmitting(false); // Re-enable button
        }
    };

    // If the modal is not open, do not render anything
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.header}>Notification Preferences</h2>
                <p className={styles.text}>Select how often you'd like to receive email notifications:</p>

                <form>
                    <div className={styles.option}>
                        <input
                            type="radio"
                            id="immediate"
                            name="preference"
                            value="immediate"
                            checked={notificationPreference === "immediate"}
                            onChange={() => setNotificationPreference("immediate")}
                        />
                        <label htmlFor="immediate">Immediate Notifications</label>
                    </div>
                    <div className={styles.option}>
                        <input
                            type="radio"
                            id="daily"
                            name="preference"
                            value="daily"
                            checked={notificationPreference === "daily"}
                            onChange={() => setNotificationPreference("daily")}
                        />
                        <label htmlFor="daily">Daily Digest</label>
                    </div>
                    <div className={styles.option}>
                        <input
                            type="radio"
                            id="weekly"
                            name="preference"
                            value="weekly"
                            checked={notificationPreference === "weekly"}
                            onChange={() => setNotificationPreference("weekly")}
                        />
                        <label htmlFor="weekly">Weekly Digest</label>
                    </div>
                    <div className={styles.option}>
                        <input
                            type="radio"
                            id="monthly"
                            name="preference"
                            value="monthly"
                            checked={notificationPreference === "monthly"}
                            onChange={() => setNotificationPreference("monthly")}
                        />
                        <label htmlFor="monthly">Monthly Digest</label>
                    </div>
                    <div className={styles.option}>
                        <input
                            type="radio"
                            id="none"
                            name="preference"
                            value="none"
                            checked={notificationPreference === "none"}
                            onChange={() => setNotificationPreference("none")}
                        />
                        <label htmlFor="none">No Emails</label>
                    </div>
                </form>

                <div className={styles.actions}>
                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                        disabled={isSubmitting} // Disable button when submitting
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Preferences;
