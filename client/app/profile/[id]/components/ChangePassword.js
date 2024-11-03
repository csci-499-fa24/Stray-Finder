import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './editProfile.module.css'

const ChangePassword = ({isOpen, onClose}) => {
    const [formData, setFormData] = useState(
        {
            currentPassword: '',
            newPassword: '',
            verifyNewPassword: '',
        });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect (() => {
        // Disable scrolling on body when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset'; // Reset to default
        }

        // Cleanup function to reset styles when the component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevdata) => ({ ...prevdata, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.verifyNewPassword) {
            setErrorMessage("New passwords do not match.");
            return;
        }
        try {
            const requestOptions = {
                method: 'PUT',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json', // Set content type
                },
                credentials: 'include',
            };
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user`,
                requestOptions
            );
            setSuccessMessage(response.data.message);
            setErrorMessage('');

            alert("Profile updated successfully");
            window.location.reload();
        } catch (error) {
            // Handle error
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("An error occurred while updating the password.");
            }
        }
    };

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={onClose}
                contentLabel="Change Password"
                ariaHideApp={false}
                className={styles.modalContent}
            >
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.input}>
                            <label htmlFor="name">Current Password</label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.input}>
                            <label htmlFor="name">New Password</label>
                            <input
                                type="text"
                                id="newPassword"
                                name="newPassword"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.input}>
                            <label htmlFor="name">Verify New Password</label>
                            <input
                                type="text"
                                id="verifyNewPassword"
                                name="verifyNewPassword"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {/* Button container for Save and Cancel buttons */}
                        <div className={styles.buttonContainer}>
                            <button type="submit" className={styles.saveButton} >
                                Change Password
                            </button>
                            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default ChangePassword;