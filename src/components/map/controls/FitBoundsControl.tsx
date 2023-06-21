import {useMap} from "react-leaflet";
import {LatLngBounds, LatLngExpression, LatLngTuple} from "leaflet";
import {useEffect} from "react";

type FitBoundsControlProps = {
    bounds: LatLngTuple[];
}

export default function FitBoundsControl({bounds}: FitBoundsControlProps) {
    const map = useMap();
    useEffect(() => {
        if (bounds.length > 0) {
            const latitudes = bounds.map(location => location[0]);
            const longitudes = bounds.map(location => location[1]);
            const southWest: LatLngExpression = [Math.min(...latitudes), Math.min(...longitudes)];
            const northEast: LatLngExpression = [Math.max(...latitudes), Math.max(...longitudes)];
            map.flyToBounds(new LatLngBounds(southWest, northEast))
        }
    },[bounds, map]);

    return null;
}