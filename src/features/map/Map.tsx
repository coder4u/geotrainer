import { JSX, useEffect } from "react"
import { useMemo } from "react"
import {icon} from "leaflet"
import markerIcon from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import shadowIcon from "leaflet/dist/images/marker-shadow.png";
import type {GeoJsonObject} from "geojson";
import countryBordersGeoJSON from "../../static/uaBorders.geo.json";
import type { LatLngTuple } from "leaflet"
import "leaflet/dist/leaflet.css"
import {
    GeoJSON,
    MapContainer,
    Marker,
    Rectangle,
    TileLayer,
    ZoomControl,
} from "react-leaflet"
import { useAppSelector, useAppDispatch } from "../../app/hooks.ts"
import {RectangleBounds, useGetSettlementsByBoundsQuery} from "./mapAPI.ts";
import {setFirstStep} from "../game/gameSlice.ts";
import {questionCount, setAllVariants} from "../variantsList/variantsListSlice.ts";
import {setRectangleBounds} from "./mapSlice.ts";
import Loading from "../loading/Loading.tsx";
import FocusMarkerButton from "./FocusMarkerButton.tsx";
import MapInteractionController from "./MapInteractionController.tsx";
import MapCursorController from "./MapCursorController.tsx";
import RectangleDrawer from "./RectangleDrawer.tsx";

const position: LatLngTuple = [50.4501, 30.5234];

const DefaultIcon = icon({
    iconUrl: markerIcon,
    iconRetinaUrl: iconRetina,
    shadowUrl: shadowIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

export const Map = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const step = useAppSelector(state => state.game.step)
    const currentAnswer = useAppSelector(state => state.variantsList.currentAnswer)
    const allVariants = useAppSelector(state => state.variantsList.allVariants)
    const rectangleBounds = useAppSelector(state => state.map.rectangleBounds)

    const rectangleLatLngBounds = useMemo(() => {
        if (!rectangleBounds) {
            return null
        }

        return [
            [rectangleBounds.south, rectangleBounds.west],
            [rectangleBounds.north, rectangleBounds.east],
        ] as LatLngTuple[]
    }, [rectangleBounds])

    const {currentData: settlementsData, isFetching, isError, } = useGetSettlementsByBoundsQuery(rectangleBounds as RectangleBounds, {
        skip: !rectangleBounds || step !== "questions",
    });

    const isLabelsShown = step !== "questions"
    const imageryTileLayerUrl =
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    const labelsTileLayerUrl =
        "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"

    const isDrawingRectangle = step === "drawRectangle"

    useEffect(() => {
        if (settlementsData && settlementsData.length >= questionCount) {
            dispatch(setAllVariants(settlementsData));
        } else if (settlementsData && settlementsData.length < questionCount) {
            alert("Not enough settlements to play. Please change the area.");
            dispatch(setFirstStep());
        }
    }, [settlementsData]);

    useEffect(() => {
        if (step === "drawRectangle") {
            dispatch(setRectangleBounds(null));
        }
    }, [step])

    useEffect(() => {
        if (step === "questions" && settlementsData && settlementsData.length > 0) {
            dispatch(setAllVariants(settlementsData));
        }
    }, [step])

    useEffect(() => {
        if (isError) {
            alert('Error fetching settlements. Please try again.');

            dispatch(setFirstStep());
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
                        attribution="Tiles &copy; Esri"
                        url={imageryTileLayerUrl}
                    />

                    {!isLabelsShown && (
                        <GeoJSON
                            data={countryBordersGeoJSON as GeoJsonObject}
                            style={{
                                color: "#ffd60a",
                                weight: 2,
                                fillOpacity: 0,
                                opacity: 1,
                            }}
                        />
                    )}

                    {isLabelsShown && (
                        <TileLayer
                            attribution="Labels &copy; Esri"
                            url={labelsTileLayerUrl}
                            pane="overlayPane"
                        />
                    )}

                    {!isDrawingRectangle && <ZoomControl position="topleft" />}

                    <MapCursorController isDrawingEnabled={isDrawingRectangle} />
                    <MapInteractionController isDrawingEnabled={isDrawingRectangle} />

                    {currentSettlement && step === 'questions' && (
                        <>
                            <Marker
                                position={currentSettlement.coords}
                                icon={DefaultIcon}
                            >
                            </Marker>
                            <FocusMarkerButton
                                markerPosition={currentSettlement.coords}
                            />
                        </>
                    )}

                    {step === "drawRectangle" && (
                        <>
                            <RectangleDrawer
                                isDrawingEnabled={isDrawingRectangle}
                                onBoundsChange={(bounds) => dispatch(setRectangleBounds(bounds))}
                                onDrawStart={() => dispatch(setRectangleBounds(null))}
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
