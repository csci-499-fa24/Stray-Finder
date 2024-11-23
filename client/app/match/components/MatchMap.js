import React, { useState, useEffect, useRef } from 'react'
import {
    GoogleMap,
    Marker,
    InfoWindow,
    useLoadScript,
} from '@react-google-maps/api'

const containerStyle = {
	width: '400px',
	height: '400px',
	maxWidth: '500px',
  	maxHeight: '500px',
	overflow: 'hidden',
}

// Helper function to create a circular icon with CORS handling
const createCircularIcon = (imageUrl, callback) => {
    const img = new Image()
    img.crossOrigin = 'anonymous' // Allow cross-origin images
    img.src = imageUrl

    img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 50
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')

        // Create a circle
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.clip()

        // Draw the image into the circular region
        ctx.drawImage(img, 0, 0, size, size)

        // Call the callback with the circular icon data URL
        callback(canvas.toDataURL())
    }

    img.onerror = (error) => {
        callback(null) // Return null if image loading fails
    }
}
const midPoint = (lat1, lng1, lat2, lng2) => {
	// Convert degrees to radians
	lat1 = lat1 * Math.PI / 180;
	lng1 = lng1 * Math.PI / 180;
	lat2 = lat2 * Math.PI / 180;
	lng2 = lng2 * Math.PI / 180;
  
	// Calculate midpoint
	const mid_lat = (lat1 + lat2) / 2;
	const mid_lng = (lng1 + lng2) / 2;
  
	// Convert radians back to degrees
	return {
		lat: mid_lat * 180 / Math.PI,
		lng: mid_lng * 180 / Math.PI
	};
}

const MatchMap = ({report1, report2}) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    })
	const center = midPoint(
		report1.location.coordinates.coordinates[1],
		report1.location.coordinates.coordinates[0],
		report2.location.coordinates.coordinates[1],
		report2.location.coordinates.coordinates[0],
	)
	const [selectedReport, setSelectedReport] = useState(null)
    const [iconUrls, setIconUrls] = useState({}) // State to store circular icons

	//create markers
	const markers = [
		{
			id: 1,
			lat: report1.location.coordinates.coordinates[1],
			lng: report1.location.coordinates.coordinates[0],
			imageUrl: report1.animal.imageUrl,
			title: report1.animal.name,
		},
		{
			id: 2,
			lat: report2.location.coordinates.coordinates[1],
		  	lng: report2.location.coordinates.coordinates[0],
			imageUrl: report2.animal.imageUrl,
			title: report2.animal.name,
		},
	];

	// Preload and create circular icons for each report

	useEffect(() => {
		setIconUrls({});

		// Process markers to create icons if not already cached
		markers.forEach((marker) => {
			createCircularIcon(marker.imageUrl, (iconUrl) => {
				if (iconUrl) {
					setIconUrls((prev) => ({
						...prev,
						[marker.id]: iconUrl, // Set the icon URL for this specific marker
					}));
				}
			});
		});
	}, [report1, report2]);

	if (!isLoaded) {
		return <div>Error loading Google Maps</div>;
	}

    return (
		<div>
			<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
				{markers.map((marker) => (
					<Marker
						key={marker.id}
						position={{ lat: marker.lat, lng: marker.lng }}
						title={marker.title}
						icon={iconUrls[marker.id]}
					/>
				))}
				{selectedReport && (
					<InfoWindow
						position={{
							lat: selectedReport.location.coordinates.coordinates[1],
							lng: selectedReport.location.coordinates.coordinates[0],
						}}
						onCloseClick={() => setSelectedReport(null)}
					>
						<div>
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
							<p>
								Date Reported:{' '}
								{new Date(
									selectedReport.dateReported
								).toLocaleDateString()}
							</p>
							<p>
								Address:{' '}
								{selectedReport.location.address ||
									'Address not provided'}
							</p>
						</div>
					</InfoWindow>
				)}
			</GoogleMap>
		</div>
    )
}

export default MatchMap;