import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import ChangePassword from './ChangePassword';
import styles from './editProfile.module.css'
import PenIcon from './PenIcon';

const EditProfile = ({ user, isOpen, onClose }) => {
    const [formData, setFormData] = useState(
        {
            username: '',
            email: '',
        });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editName, setEditName] = useState(false);
    const [editEmail, setEditEmail] = useState(false);

    useEffect (() => {
        if(user){
            setFormData({
                username: user.username,
                email: user.email,
            });
        }

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
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevdata) => ({ ...prevdata, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            console.log(formData);
            const requestOptions1 = {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json', // Set content type
                },
                credentials: 'include',
            };
            const response1 = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user`,
                requestOptions1
            );

            if (!response1.ok) {
                throw new Error('Failed to update user');
            }
            const data = await response1.json();
            alert("Profile updated successfully");
            window.location.reload();

        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={onClose}
                contentLabel="Edit Profile"
                ariaHideApp={false}
                className={styles.modalContent}
            >
                <h2 className ={styles.heading}>Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.input}>
                        <label htmlFor="name">Username
                            <button className={styles.resetButton} type="button" onClick={() => setEditName(true)}>
                                <PenIcon length={20}/>
                            </button>
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={!editName}
                            required
                        />
                    </div>
                    <div className={styles.input}>
                        <label htmlFor="name">Email
                            <button className={styles.resetButton} type="button" onClick={() => setEditEmail(true)}>
                                <PenIcon length={20}/>
                            </button>
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!editEmail}
                            required
                        />
                    </div>

                    {/* Button container for Save and Cancel buttons */}
                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default EditProfile;