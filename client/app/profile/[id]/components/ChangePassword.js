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
            setSuccessMessage(''); // Clear success message
            return;
        }

        if(formData.currentPassword == formData.newPassword){
            setErrorMessage("New passwords and Old password cannot be the same.");
            setSuccessMessage(''); // Clear success message
            return;
        }
        
        try {
            const requestOptions = {
                method: 'PUT',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            };
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user`, requestOptions);
    
            const data = await response.json();
    
            if (response.ok) {
                setSuccessMessage(data.message || "Profile updated successfully.");
                setErrorMessage('');
                // alert("Profile updated successfully");
                window.location.reload();
            } else {
                setErrorMessage(data.message || "An error occurred.");
                setSuccessMessage(''); // Clear success message
            }
        } catch (error) {
            setErrorMessage("An error occurred while updating the password.");
            setSuccessMessage(''); // Clear success message
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
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </Modal>
        </div>
    );
};

export default ChangePassword;