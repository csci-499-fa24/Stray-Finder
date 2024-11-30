import React from 'react'
import { InfoWindow } from '@react-google-maps/api'

const InfoWindowDetails = ({ selectedReport, setSelectedReport }) => {
    return (
        <InfoWindow
            position={{
                lat: selectedReport.location.coordinates.coordinates[1],
                lng: selectedReport.location.coordinates.coordinates[0],
            }}
            onCloseClick={() => setSelectedReport(null)}
        >
            <div className="info-window">
                <h3>
                    {selectedReport.animal.name} (
                    {selectedReport.animal.species})
                </h3>
                <img
                    src={selectedReport.animal.imageUrl}
                    alt={selectedReport.animal.name}
                    style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                    }}
                />
                <p>Breed: {selectedReport.animal.breed}</p>
                <p>Color: {selectedReport.animal.color}</p>
                <p>Gender: {selectedReport.animal.gender}</p>
                <p>Report Type: {selectedReport.reportType}</p>
                <p>Fixed Status: {selectedReport.animal.fixed}</p>
                <p>Collar: {selectedReport.animal.collar ? "Yes" : "No"}</p>
                <p>Date Reported: {new Date(selectedReport.dateReported).toLocaleDateString()}</p>
                <p>Address: {selectedReport.location.address || 'Address not provided'}</p>

                {/* Other details */}
            </div>
        </InfoWindow>
    )
}

export default InfoWindowDetails
