import {useEffect} from "react";
import {useMap} from "react-leaflet";

type MapCursorControllerProps = {
    isDrawingEnabled: boolean
}

const MapCursorController = ({ isDrawingEnabled}: MapCursorControllerProps): null => {
    const map = useMap()

    useEffect(() => {
        const container = map.getContainer()
        const previousCursor = container.style.cursor

        container.style.cursor = isDrawingEnabled ? "crosshair" : ""

        return () => {
            container.style.cursor = previousCursor
        }
    }, [map, isDrawingEnabled])

    return null
}

export default MapCursorController;