import React from 'react'

const ActivateStoryButton = ({ onClick, isActive }) => {
    return (
        <button
            className={`btn btn-primary position-absolute activate-story-button ${
                isActive ? 'btn-danger' : 'btn-primary'
            }`}
            onClick={onClick}
            style={{
                width: isActive ? '150px' : '40px',
                transition: 'width 0.3s',
            }}
        >
            {isActive ? 'Deactivate Story' : 'Activate'}
        </button>
    )
}

export default ActivateStoryButton
