import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM for portals
import './CommentModal.css';

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const CommentModal = ({ animalId, reportId, image, description, onClose }) => {
  const [comments, setComments] = useState([]); // To hold fetched comments
  const [newComment, setNewComment] = useState(''); // For the new comment input

  // Fetch comments when the modal opens
  useEffect(() => {
    fetch(`${BASE_URL}/api/comments/${reportId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setComments(data)) // Set fetched comments
      .catch((error) => console.error('Error fetching comments:', error));
  }, [reportId]);

  // Add a new comment
  const handleAddComment = () => {
    fetch(`${BASE_URL}/api/comments/${reportId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content: newComment }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setComments([...comments, data]); // Append new comment
        setNewComment(''); // Clear input only on success
      })
      .catch((error) => console.error('Error adding comment:', error));
  };

  // Helper function to format the timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const timeDifference = now - commentDate;

    if (timeDifference < 24 * 60 * 60 * 1000) {
      // Show time for comments posted within 24 hours
      return commentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // Show date for comments posted more than 24 hours ago
      return commentDate.toLocaleDateString();
    }
  };

  // Modal JSX
  const modalContent = (
    <div className="comment-modal">
      <div className="comment-modal-content">
        <button onClick={onClose} className="comment-close-button">&times;</button>
        <div className="comment-modal-body">
          {/* Left Section: Animal Image and Description */}
          <div className="comment-left-section">
            <img src={image || '/placeholder.png'} alt="Animal" />
            <p>{description}</p>
          </div>

          {/* Right Section: Comments */}
          <div className="comment-right-section">
            <h3>Comments</h3>
            <div className="comment-comments-list">
              {comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  {/* Avatar and Text Side-by-Side */}
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

            {/* Add Comment Input */}
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the modal using React Portal
  return ReactDOM.createPortal(modalContent, document.body);
};

export default CommentModal;
