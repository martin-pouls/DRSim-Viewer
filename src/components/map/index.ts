import dynamic from "next/dynamic";

export const MapNoSsr = dynamic(() => import("./Map"), {
    ssr: false
});

export const AnimatedVehicleMarkerNoSsr = dynamic(() => import("./marker/AnimatedVehicleMarker"), {
    ssr: false
});

export const VehicleMarkerNoSsr = dynamic(() => import("./marker/VehicleMarker"), {
    ssr: false
});

export const VehicleLayerNoSsr = dynamic(() => import("./layer/VehicleLayer"), {
    ssr: false
});

export const FitBoundsControlNoSsr = dynamic(() => import("./controls/FitBoundsControl"), {
    ssr: false
});