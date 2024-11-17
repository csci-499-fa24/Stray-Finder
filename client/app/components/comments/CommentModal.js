import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaSpinner } from 'react-icons/fa';
import './CommentModal.css';

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const CommentModal = ({ animalId, reportId, image, description, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(''); // State for authentication error messages

  useEffect(() => {
    setTimeout(() => {
      fetch(`${BASE_URL}/api/comments/${reportId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
        .then((response) => {
          if (response.status === 401) {
            throw new Error('Unauthorized. Please sign in to view comments.');
          }
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setComments(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching comments:', error);
          setAuthError(error.message); // Set the error message for UI display
          setIsLoading(false);
        });
    }, 500);
  }, [reportId]);

  const handleAddComment = () => {
    setIsPosting(true);
    fetch(`${BASE_URL}/api/comments/${reportId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content: newComment }),
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please sign in to post a comment.');
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setComments([...comments, data]);
        setNewComment('');
        setIsPosting(false);
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
        setAuthError(error.message); // Set the error message for UI display
        setIsPosting(false);
      });
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const timeDifference = now - commentDate;

    if (timeDifference < 24 * 60 * 60 * 1000) {
      return commentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return commentDate.toLocaleDateString();
    }
  };

  const modalContent = (
    <div className="comment-modal">
      <div className="comment-modal-content">
        <button onClick={onClose} className="comment-close-button">&times;</button>
        <div className="comment-modal-body">
          <div className="comment-left-section">
            <img src={image || '/paw-pattern.jpg'} alt="Animal" />
            <p>{description}</p>
          </div>
          <div className="comment-right-section">
            <h3>Comments</h3>
            {isLoading ? (
              <div className="spinner-container">
                <FaSpinner className="loading-spinner" />
              </div>
            ) : authError ? (
              <div className="auth-error">
                <p>{authError}</p>
              </div>
            ) : (
              <div className="comment-comments-list">
                {comments.map((comment, index) => (
                  <div key={index} className="comment-item">
                    <div className="comment-avatar">
                      {comment.userId?.profileImage ? (
                        <img
                          src={comment.userId.profileImage}
                          alt={`${comment.userId.username}'s avatar`}
                          className="comment-avatar-image"
                        />
                      ) : (
                        <span className="comment-avatar-placeholder">
                          {comment.userId?.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="comment-text">
                      <span className="comment-username">{comment.userId?.username}</span>
                      <p className="comment-content">{comment.content}</p>
                      <span className="comment-timestamp">{formatTimestamp(comment.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="comment-input-container">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isPosting || !!authError}
                className="comment-input"
              />
              <button
                onClick={handleAddComment}
                disabled={isPosting || !newComment.trim() || !!authError}
                className={`post-button ${isPosting ? 'disabled' : ''}`}
              >
                {isPosting ? <FaSpinner className="posting-spinner" /> : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default CommentModal;
