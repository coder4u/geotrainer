import { JSX, useEffect } from "react"
import { useMemo, useState } from "react"
import { LatLngBounds, icon } from "leaflet"
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import type { LatLng, LatLngTuple } from "leaflet"
import "leaflet/dist/leaflet.css"
import {
    MapContainer, Marker,
    Rectangle,
    TileLayer,
    useMap,
    useMapEvents,
    ZoomControl,
} from "react-leaflet"
import { useAppSelector, useAppDispatch } from "../../app/hooks.ts"
import {useGetSettlementsByBoundsQuery} from "./mapAPI.ts";
import {setAllVariants, setParam, setStep} from "../game/gameSlice.ts";
import Loading from "../loading/Loading.tsx";

const position: LatLngTuple = [50.4501, 30.5234]

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

type MapCursorControllerProps = {
    isDrawingEnabled: boolean
}

const MapCursorController = ({
    isDrawingEnabled,
}: MapCursorControllerProps): null => {
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

type MapInteractionControllerProps = {
    isDrawingEnabled: boolean
}

const DefaultIcon = icon({
    iconUrl: markerIcon,
    iconRetinaUrl: iconRetina,
    shadowUrl: shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

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

export const Map = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const step = useAppSelector(state => state.game.step)
    const currentAnswer = useAppSelector(state => state.game.currentAnswer)
    const allVariants = useAppSelector(state => state.game.allVariants)
    const [rectangleBounds, setRectangleBounds] = useState<RectangleBounds | null>(null)

    const rectangleLatLngBounds = useMemo(() => {
        if (!rectangleBounds) {
            return null
        }

        return [
            [rectangleBounds.south, rectangleBounds.west],
            [rectangleBounds.north, rectangleBounds.east],
        ] as LatLngTuple[]
    }, [rectangleBounds])

    useEffect(() => {
        if (rectangleLatLngBounds) {
            dispatch(setParam({ name: "buttonText", value: "Next" }));
        }
    }, [rectangleLatLngBounds]);

    const {currentData: settlementsData, refetch, isFetching, isError, } = useGetSettlementsByBoundsQuery(rectangleBounds as RectangleBounds, {
        skip: !rectangleBounds || step !== "questions",
    });

    const isLabelsShown = step !== "questions"
    const labelsPath = isLabelsShown
        ? "rastertiles/voyager"
        : "rastertiles/voyager_nolabels"

    const isDrawingRectangle = step === "drawRectangle"

    useEffect(() => {
        if (settlementsData && settlementsData.length > 0) {
            dispatch(setAllVariants(settlementsData));
        } else {
            // alert('No settlements found in the selected area. Please try again with a different area or draw a rectangle on the map.')
        }
    }, [settlementsData]);

    useEffect(() => {
        if (step === "drawRectangle") {
            setRectangleBounds(null)
        }
    }, [step])

    useEffect(() => {
        if (step === "questions" && settlementsData) {
            refetch();
        }
    }, [step])

    useEffect(() => {
        if (isError) {
            alert('Error fetching settlements. Please try again.');

            dispatch(setStep('selectArea'));
        }
    }, [isError]);

    const currentSettlement = (allVariants || []).find((item) => item.name === currentAnswer);

    return (
        <>
            <div className="map-container">
                <MapContainer
                    center={position}
                    zoom={10}
                    zoomControl={false}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                        url={`https://{s}.basemaps.cartocdn.com/${labelsPath}/{z}/{x}/{y}{r}.png`}
                    />

                    {!isDrawingRectangle && <ZoomControl position="topleft" />}

                    <MapCursorController isDrawingEnabled={isDrawingRectangle} />
                    <MapInteractionController isDrawingEnabled={isDrawingRectangle} />

                    {currentSettlement && step === 'questions' && (
                        <Marker
                            position={currentSettlement.coords}
                            icon={DefaultIcon}
                        >
                        </Marker>
                    )}

                    {step === "drawRectangle" && (
                        <>
                            <RectangleDrawer
                                isDrawingEnabled={isDrawingRectangle}
                                onBoundsChange={setRectangleBounds}
                                onDrawStart={() => setRectangleBounds(null)}
                            />
                            {rectangleLatLngBounds && (
                                <Rectangle
                                    bounds={rectangleLatLngBounds}
                                    pathOptions={{
                                        color: "#2563eb",
                                        weight: 2,
                                        fillOpacity: 0.1,
                                    }}
                                />
                            )}
                        </>
                    )}
                </MapContainer>
            </div>
            {isFetching && (
                <Loading />
            )}
        </>
    )
}
