import React from "react";
import ReactDOM from "react-dom";
import styles from './Modal.module.css';

const Modal = ({ children, onClose }) => {
    const modalContent = (
        <div className={styles['modal-overlay']} onClick={onClose}>
            <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                <button className={styles['modal-close-button']} onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
    return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
