import {FileInput, Group} from "@mantine/core";
import React, {Dispatch, SetStateAction, useState} from "react";
import Papa, {ParseResult} from "papaparse";
import dayjs from "dayjs";

type ReplayFileLoaderProps = {
    setMovementReplayByVehicle: (value: Map<number, Array<Array<any>>>) => void;
    setStateReplayByVehicle: (value: Map<number, Array<Array<any>>>) => void;
    setRequestReplay: Dispatch<SetStateAction<Array<Array<any>>>>;
    setStart: Dispatch<SetStateAction<dayjs.Dayjs | undefined>>;
    setMaxTime: Dispatch<SetStateAction<number>>;
    startLoadingCallback: () => void;
    setNumLoadedFiles: Dispatch<SetStateAction<number>>;
}

export default function ReplayFileLoader(props: ReplayFileLoaderProps) {
    const mandatoryFiles = ["vehicleStatesReplay.csv", "vehicleMovementReplay.csv", "requestReplay.csv", "simulation.json"];
    const {setMovementReplayByVehicle, setStateReplayByVehicle, setRequestReplay, startLoadingCallback,
        setStart, setNumLoadedFiles, setMaxTime} = props;
    const [error, setError] = useState("");

    const readCsvFileIntoMap = (result: ParseResult<any>): Map<number, Array<Array<any>>> => {
        let currentVehicleId = undefined;
        let previousSliceIndex = 0;
        let entriesByVehicle = new Map<number, Array<Array<any>>>
        for (let i = 0; i < result.data.length; i++) {
            let entry = result.data[i];
            if (i == 0) {
                currentVehicleId = entry[0];
            }
            if (entry[0] !== currentVehicleId) {
                entriesByVehicle.set(currentVehicleId, result.data.slice(previousSliceIndex, i));
                previousSliceIndex = i;
                currentVehicleId = entry[0];
            }
            if (i === result.data.length - 1) {
                currentVehicleId = entry[0];
                entriesByVehicle.set(currentVehicleId, result.data.slice(previousSliceIndex, i + 1));
            }
        }
        return entriesByVehicle;
    }

    const incrementLoadedFiles = () => {
        setNumLoadedFiles(previous => previous + 1);
    }

    const onMovementReplayRead = (result: ParseResult<any>) => {
        const map = readCsvFileIntoMap(result);
        setMovementReplayByVehicle(map);
        incrementLoadedFiles();
    }

    const onVehiclesStatesRead = (result: ParseResult<any>) => {
        const map = readCsvFileIntoMap(result);
        setStateReplayByVehicle(map);
        incrementLoadedFiles();
    }

    const onRequestReplayRead = (result: ParseResult<any>) => {
        setRequestReplay(result.data);
        incrementLoadedFiles();
    }

    const checkFiles = (files: File[]) => {
        let fileNames = files.map(f => f.name);
        if (fileNames.length !== mandatoryFiles.length) {
            return false;
        }
        for (let mandatoryFile of mandatoryFiles) {
            if (!fileNames.includes(mandatoryFile)) {
                return false;
            }
        }
        return true;
    }

    const readSimulationJson = (file: File) => {
        file.text().then((value: string) => {
            const simulationLog = JSON.parse(value);
            let start = dayjs(simulationLog.start);
            setStart(start);
            let end = dayjs(simulationLog.end);
            setMaxTime(end.diff(start, "s"));
            incrementLoadedFiles();
        });
    }

    const onFileChange = (files: File[]) => {
        if (checkFiles(files)) {
            startLoadingCallback();
            setError("");
            for (const file of files) {
                if (file.name === "vehicleMovementReplay.csv") {
                    Papa.parse(file, {delimiter: ";", complete: onMovementReplayRead, dynamicTyping: true, worker: true});
                } else if (file.name === "vehicleStatesReplay.csv") {
                    Papa.parse(file, {delimiter: ";", complete: onVehiclesStatesRead, dynamicTyping: true, worker: true});
                } else if (file.name === "requestReplay.csv") {
                    Papa.parse(file, {delimiter: ";", complete: onRequestReplayRead, dynamicTyping: true, worker: true});
                } else if (file.name === "simulation.json") {
                    readSimulationJson(file);
                }
            }
        } else {
            setError("Please select the correct files.")
        }
    }

    return (
        <Group>
            <FileInput
                placeholder=""
                description={`Select your simulation replay files (${mandatoryFiles.join(", ")}).`}
                label="Simulation replay"
                accept="application/csv"
                multiple
                error={error}
                onChange={onFileChange}/>
        </Group>
    )
}