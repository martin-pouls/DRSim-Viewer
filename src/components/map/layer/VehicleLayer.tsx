// @ts-nocheck
import {VehicleMarkerNoSsr} from "@/components/map";

type VehicleLayerProps = {
    movementReplayByVehicle: Map<number, Array<Array<any>>>;
    stateReplayByVehicle: Map<number, Array<Array<any>>>;
}

export default function VehicleLayer(props: VehicleLayerProps) {
    const {movementReplayByVehicle, stateReplayByVehicle} = props;
    const vehicleIds = Array.from(movementReplayByVehicle.keys());

    return (
        <>
            { vehicleIds.map((id: number) => (
                <VehicleMarkerNoSsr vehicleId={id}
                                    movementReplay={movementReplayByVehicle.get(id)}
                                    stateReplay={stateReplayByVehicle.get(id)}
                                    key={id}/>
            ))}
        </>
    )
}