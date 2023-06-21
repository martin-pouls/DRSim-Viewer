import React, {useEffect, useState} from "react";
import L, {LatLngTuple} from "leaflet";
import {MovingMarker} from "@/components/map/marker/MovingMarker";

type AnimatedVehicleMarkerProps = {
    start: LatLngTuple;
    target: LatLngTuple;
    duration: number;
    color: string;
}

export default function AnimatedVehicleMarkerProps({start, target, duration, color}: AnimatedVehicleMarkerProps) {
    const baseStyle = `height: 12px;
      width: 12px;
      border-radius: 50%;
      display: inline-block;
      border: 1px solid #000000`;

    const createIcon = (color: string) => {
        const markerStyle = `background-color: ${color}; ${baseStyle}`;
        return L.divIcon({
            className: "None",
            html: `<span style="${markerStyle}" />`
        })
    }

    const [icon, setIcon] = useState<L.DivIcon>(createIcon(color));

    useEffect(() => {
        setIcon(createIcon(color));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color])

    return (
        // @ts-ignore
        <MovingMarker position={target}
                      icon={icon}
                      previousPosition={start}
                      duration={duration}/>
    )
}