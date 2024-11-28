import React, { useState } from 'react';
import './TruncatedDescription.css';

const TruncatedDescription = ({ description, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const truncatedLength = 70; // Limit for truncation

  // Truncate the description if it's longer than the truncated length
  const truncatedText = description.length > truncatedLength
    ? `${description.substring(0, truncatedLength - 10)}...`
    : description;

  return (
    <div className={`truncated-container ${className}`}>
      <span className={isExpanded ? "truncated-expanded" : "truncated-text"}>
        {!isExpanded ? truncatedText : description}
      </span>
      {description.length > truncatedLength && (
        <button onClick={toggleExpand} className="truncated-toggle-button">
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default TruncatedDescription;
