import React from 'react'
import { Marker } from '@react-google-maps/api'

const Markers = ({ reports, iconUrls, setSelectedReport }) => {
    return (
        <>
            {reports.map((report) => {
                const { location } = report
                if (
                    location &&
                    location.coordinates &&
                    Array.isArray(location.coordinates.coordinates) &&
                    location.coordinates.coordinates.length === 2
                ) {
                    const [lng, lat] = location.coordinates.coordinates
                    const iconUrl = iconUrls[report._id]

                    const iconConfig = iconUrl
                        ? {
                              url: iconUrl,
                              scaledSize: new window.google.maps.Size(50, 50),
                          }
                        : undefined

                    return (
                        <Marker
                            key={report._id}
                            position={{ lat, lng }}
                            icon={iconConfig}
                            onClick={() => setSelectedReport(report)}
                        />
                    )
                }
                return null
            })}
        </>
    )
}

export default Markers
