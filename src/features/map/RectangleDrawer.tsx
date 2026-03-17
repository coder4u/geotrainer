import {type LatLng, LatLngBounds} from "leaflet";
import {JSX, useState} from "react";
import {Rectangle, useMapEvents} from "react-leaflet";

type RectangleBounds = {
    north: number
    south: number
    east: number
    west: number
}

const getRectangleBounds = (bounds: LatLngBounds): RectangleBounds => ({
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    east: bounds.getEast(),
    west: bounds.getWest(),
})

type RectangleDrawerProps = {
    isDrawingEnabled: boolean
    onBoundsChange: (bounds: RectangleBounds | null) => void
    onDrawStart: () => void
}

const RectangleDrawer = ({
    isDrawingEnabled,
    onBoundsChange,
    onDrawStart,
}: RectangleDrawerProps): JSX.Element | null => {
    const [startPoint, setStartPoint] = useState<LatLng | null>(null)
    const [previewPoint, setPreviewPoint] = useState<LatLng | null>(null)

    useMapEvents({
        click(event) {
            if (!isDrawingEnabled) {
                return
            }

            if (!startPoint) {
                onDrawStart()
                setStartPoint(event.latlng)
                setPreviewPoint(event.latlng)
                return
            }

            const nextBounds = new LatLngBounds(startPoint, event.latlng)

            onBoundsChange(getRectangleBounds(nextBounds))
            setStartPoint(null)
            setPreviewPoint(null)
        },
        mousemove(event) {
            if (!isDrawingEnabled || !startPoint) {
                return
            }

            setPreviewPoint(event.latlng)
        },
    })

    if (!isDrawingEnabled || !startPoint || !previewPoint) {
        return null
    }

    return (
        <Rectangle
            bounds={new LatLngBounds(startPoint, previewPoint)}
            pathOptions={{
                color: "#2563eb",
                weight: 2,
                fillOpacity: 0.15,
            }}
        />
    )
}

export default RectangleDrawer;