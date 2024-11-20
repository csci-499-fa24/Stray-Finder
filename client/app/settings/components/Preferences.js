"use client";

import { useState } from 'react';
import styles from './Preferences.module.css'; // Import CSS for styling

const Preferences = ({ isOpen, onClose, user }) => {
    const [notificationPreference, setNotificationPreference] = useState(user?.notificationPreference || 'immediate');

    const handleSave = async () => {
        try {
            // Save the selected preference to the database
            const response = await fetch('/api/user/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationPreference }),
            });

            if (!response.ok) {
                throw new Error('Failed to update preferences');
            }
            alert('Preferences updated successfully!');
            onClose(); // Close the modal
        } catch (error) {
            console.error(error);
            alert('Something went wrong while saving preferences.');
        }
    };

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
                            checked={notificationPreference === 'immediate'}
                            onChange={() => setNotificationPreference('immediate')}
                        />
                        <label htmlFor="immediate">Immediate Notifications</label>
                    </div>
                    <div className={styles.option}>
                        <input
                            type="radio"
                            id="daily"
                            name="preference"
                            value="daily"
                            checked={notificationPreference === 'daily'}
                            onChange={() => setNotificationPreference('daily')}
                        />
                        <label htmlFor="daily">Daily Digest</label>
                    </div>
                    <div className={styles.option}>
                        <input
                            type="radio"
                            id="weekly"
                            name="preference"
                            value="weekly"
                            checked={notificationPreference === 'weekly'}
                            onChange={() => setNotificationPreference('weekly')}
                        />
                        <label htmlFor="weekly">Weekly Digest</label>
                    </div>
                </form>

                <div className={styles.actions}>
                    <button className={styles.saveButton} onClick={handleSave}>
                        Save
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
