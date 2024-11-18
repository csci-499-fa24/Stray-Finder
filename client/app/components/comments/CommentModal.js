import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaSpinner } from 'react-icons/fa';
import './CommentModal.css';

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const CommentModal = ({ animalId, reportId, image, description, onClose, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
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
        setAuthError(error.message);
        setIsLoading(false);
      });
  }, [reportId]);

  const handleAddComment = async () => {
    setIsPosting(true);
    try {
        const response = await fetch(`${BASE_URL}/api/comments/${reportId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ content: newComment }),
        });
        if (!response.ok) throw new Error('Failed to post comment');

        // Increment the comment count in the parent component
        if (onCommentAdded) {
            onCommentAdded();
        }

        // Refetch all comments to ensure completeness
        const commentsResponse = await fetch(`${BASE_URL}/api/comments/${reportId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const updatedComments = await commentsResponse.json();
        setComments(updatedComments);
        setNewComment('');
    } catch (error) {
        console.error('Error adding comment:', error);
        setAuthError(error.message);
    } finally {
        setIsPosting(false);
    }
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
                          {comment.userId?.username?.charAt(0).toUpperCase() || ''}
                        </span>
                      )}
                    </div>
                    <div className="comment-text">
                      <span className="comment-username">{comment.userId?.username || ''}</span>
                      <p className="comment-content">{comment.content}</p>
                      <span className="comment-timestamp">{formatTimestamp(comment.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="comment-input-container">
              {isPosting ? (
                <div className="posting-loader">
                  Posting<span className="bouncing-dots"><span>.</span><span>.</span><span>.</span></span>
                </div>
              ) : (
                <>
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
                    Post
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default CommentModal;
