import React from 'react'
import { Circle } from '@react-google-maps/api'

const CircleOverlay = ({ center, radius }) => (
    <Circle
        center={center}
        radius={radius * 1609.34} // Convert miles to meters
        options={{
            fillColor: 'rgba(0,0,255,0.2)',
            fillOpacity: 0.2,
            strokeColor: 'blue',
            strokeOpacity: 0.5,
            strokeWeight: 2,
        }}
    />
)

export default CircleOverlay
