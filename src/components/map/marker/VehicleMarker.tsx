import {useEffect, useState} from "react";
import {LatLngTuple} from "leaflet";
import {AnimatedVehicleMarkerNoSsr} from "@/components/map";
import {useAtom} from "jotai";
import {speedAtom, timeAtom} from "@/state/atoms";
import {SimulationTime} from "@/models/time";

type VehicleMarkerProps = {
    vehicleId: number;
    movementLog: Array<Array<any>>;
    stateLog: Array<Array<any>>;
}

export default function VehicleMarker(props: VehicleMarkerProps) {
    const colorIdle = "#5778a4";
    const colorActive = "#6a9f58";
    const colorRepositioning = "#e49444";
    const {movementLog, stateLog} = props;
    const [time,] = useAtom(timeAtom);
    const [speed,] = useAtom(speedAtom);
    const [movementLogIndex, setMovementLogIndex] = useState(0);
    const [stateLogIndex, setStateLogIndex] = useState(0);
    const [, setRoutePoints] = useState<Array<LatLngTuple>>([]);
    const [start, setStart] = useState<LatLngTuple>([movementLog[0][3], movementLog[0][4]]);
    const [target, setTarget] = useState<LatLngTuple>([movementLog[0][3], movementLog[0][4]]);
    const [color, setColor] = useState<string>("#2A81CB");
    const [movementDuration, setMovementDuration] = useState(1000);

    const interpolatePoints = (start: LatLngTuple, end: LatLngTuple, duration: number): Array<LatLngTuple> => {
        if (duration === 0) {
            return [end];
        }
        const dLat = (end[0] - start[0]) / duration;
        const dLon = (end[1] - start[1]) / duration;
        const interpolatedPoints = [start];
        for (let i = 1; i <= duration; i++) {
            interpolatedPoints.push([start[0] + dLat * i, start[1] + dLon * i]);
        }
        return interpolatedPoints;
    }

    const updateColorByState = (state: string) => {
        if (state === "I") {
            setColor(colorIdle);
        } else if (state === "R") {
            setColor(colorRepositioning);
        } else if (state === "A") {
            setColor(colorActive)
        }
    }

    const jumpState = (newTime: SimulationTime) => {
        for (let i = 0; i < stateLog.length; ++i) {
            const entry = stateLog[i];
            if (entry[1] > newTime.time) {
                const previousEntry = stateLog[i - 1];
                updateColorByState(previousEntry[2]);
                setStateLogIndex(i - 1);
                break;
            } else if (i === stateLog.length - 1) {
                updateColorByState(entry[2]);
                setStateLogIndex(i);
            }
        }
    }

    const jumpMovement = (newTime: SimulationTime) => {
        for (let i = 0; i < movementLog.length; i++) {
            const entry = movementLog[i];
            const startTime = entry[1];
            const endTime = entry[2];
            if (startTime <= newTime.time && endTime >= newTime.time) {
                const duration = entry[2] - entry[1];
                const passedDuration = newTime.time - entry[1];
                let currentRoutePoints = interpolatePoints([entry[3], entry[4]],
                    [entry[5], entry[6]], duration);
                currentRoutePoints = currentRoutePoints.slice(passedDuration);
                setRoutePoints(currentRoutePoints);
                setMovementLogIndex(i);
                setStart(currentRoutePoints[0]);
                setTarget(currentRoutePoints[0]);
                break;
            } else if (startTime > newTime.time) {
                const position: LatLngTuple = [entry[3], entry[4]];
                setStart(position);
                setTarget(position);
                setRoutePoints([]);
                setMovementLogIndex(i - 1);
                break;
            } else if (i === movementLog.length - 1) {
                const position: LatLngTuple = [entry[5], entry[6]];
                setStart(position);
                setTarget(position);
                setRoutePoints([]);
                setMovementLogIndex(i);
            }
        }
    }

    const jumpInTime = (newTime: SimulationTime) => {
        setMovementDuration(1);
        jumpState(newTime);
        jumpMovement(newTime);
    }

    const stepState = (newTime: SimulationTime) => {
        if (stateLog.length > stateLogIndex + 1 && stateLog[stateLogIndex + 1][1] <= newTime.time) {
            updateColorByState(stateLog[stateLogIndex + 1][2]);
            setStateLogIndex(stateLogIndex + 1);
        }
    }

    const updateRoutePoints = (newRoutePoints: LatLngTuple[]) => {
        if (newRoutePoints.length >= 1) {
            setStart([newRoutePoints[0][0], newRoutePoints[0][1]]);
            if (newRoutePoints.length > 1) {
                setTarget([newRoutePoints[1][0], newRoutePoints[1][1]]);
            } else if (newRoutePoints.length == 1) {
                setTarget([newRoutePoints[0][0], newRoutePoints[0][1]]);
            }
        }
    }

    const stepMovement = (newTime: SimulationTime) => {
        if (movementLog.length > movementLogIndex + 1 && movementLog[movementLogIndex + 1][1] <= newTime.time) {
            const newIndex = movementLogIndex + 1;
            const duration = movementLog[newIndex][2] - movementLog[newIndex][1];
            const start: LatLngTuple = [movementLog[newIndex][3], movementLog[newIndex][4]];
            const end: LatLngTuple = [movementLog[newIndex][5], movementLog[newIndex][6]];
            let newRoutePoints = interpolatePoints(start, end, duration);
            setRoutePoints(newRoutePoints);
            setMovementLogIndex(newIndex);
            updateRoutePoints(newRoutePoints);
        } else {
            setRoutePoints((previous) => {
                let newRoutePoints = previous.length > 1 ? previous.slice(1) : [];
                updateRoutePoints(newRoutePoints);
                return newRoutePoints;
            });
        }
    }

    const stepInTime = (newTime: SimulationTime) => {
        setMovementDuration(1000 / speed);
        stepState(newTime);
        stepMovement(newTime);
    }

    useEffect(() => {
        if (time.jump) {
            jumpInTime(time);
        } else {
            stepInTime(time);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time]);

    return (
        <AnimatedVehicleMarkerNoSsr start={start} target={target} color={color} duration={movementDuration}/>
    )
}