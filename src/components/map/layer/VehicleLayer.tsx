// @ts-nocheck
import {VehicleMarkerNoSsr} from "@/components/map";

type VehicleLayerProps = {
    movementLogByVehicle: Map<number, Array<Array<any>>>;
    stateLogByVehicle: Map<number, Array<Array<any>>>;
}

export default function VehicleLayer(props: VehicleLayerProps) {
    const {movementLogByVehicle, stateLogByVehicle} = props;
    const vehicleIds = Array.from(movementLogByVehicle.keys());

    return (
        <>
            { vehicleIds.map((id: number) => (
                <VehicleMarkerNoSsr vehicleId={id}
                                    movementLog={movementLogByVehicle.get(id)}
                                    stateLog={stateLogByVehicle.get(id)}
                                    key={id}/>
            ))}
        </>
    )
}