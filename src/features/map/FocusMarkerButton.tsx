import type {LatLngExpression} from "leaflet";
import targetIcon from "../../static/target.svg"
import {useMap} from "react-leaflet"
import {JSX} from "react";
import {useTranslation} from "react-i18next";

type FocusMarkerButtonProps = {
    markerPosition: LatLngExpression | null
}

const FocusMarkerButton = ({ markerPosition }: FocusMarkerButtonProps): JSX.Element | null => {
    const map = useMap();
    const { t } = useTranslation();

    if (!markerPosition) {
        return null
    }

    const handleClick = (): void => {
        map.flyTo(markerPosition, undefined, {
            animate: true,
            duration: 1.2,
        })
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className="map-to-point-button"
            title={t('Move to target')}
        >
            <img src={targetIcon} alt={t('Move to target')} />
        </button>
    )
}

export default FocusMarkerButton;