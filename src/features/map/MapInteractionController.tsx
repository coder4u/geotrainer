import {useMap} from "react-leaflet";
import {useEffect} from "react";

type MapInteractionControllerProps = {
    isDrawingEnabled: boolean
}

const MapInteractionController = ({
  isDrawingEnabled,
}: MapInteractionControllerProps): null => {
    const map = useMap()

    useEffect(() => {
        if (!isDrawingEnabled) {
            return
        }

        map.dragging.disable()
        map.scrollWheelZoom.disable()
        map.doubleClickZoom.disable()
        map.touchZoom.disable()
        map.boxZoom.disable()
        map.keyboard.disable()

        return () => {
            map.dragging.enable()
            map.scrollWheelZoom.enable()
            map.doubleClickZoom.enable()
            map.touchZoom.enable()
            map.boxZoom.enable()
            map.keyboard.enable()
        }
    }, [map, isDrawingEnabled])

    return null
}

export default MapInteractionController;