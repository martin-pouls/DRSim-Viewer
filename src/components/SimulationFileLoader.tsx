import {FileInput, Group} from "@mantine/core";
import React, {Dispatch, SetStateAction, useState} from "react";
import Papa, {ParseResult} from "papaparse";
import dayjs from "dayjs";

type SimulationFileLoaderProps = {
    setMovementLogByVehicle: (value: Map<number, Array<Array<any>>>) => void;
    setStateLogByVehicle: (value: Map<number, Array<Array<any>>>) => void;
    setRequestLog: Dispatch<SetStateAction<Array<Array<any>>>>;
    setStart: Dispatch<SetStateAction<dayjs.Dayjs | undefined>>;
    setMaxTime: Dispatch<SetStateAction<number>>;
    startLoadingCallback: () => void;
    setLoadedFiles: Dispatch<SetStateAction<number>>;
    setReadingFiles: Dispatch<SetStateAction<boolean>>;
}

export default function SimulationFileLoader(props: SimulationFileLoaderProps) {
    const mandatoryFiles = ["vehicleStatesLog.csv", "movementLog.csv", "requestLog.csv", "simulationLog.json"];
    const {setMovementLogByVehicle, setStateLogByVehicle, setRequestLog, startLoadingCallback,
        setStart, setLoadedFiles,
        setReadingFiles, setMaxTime} = props;
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
        setLoadedFiles((previous) => {
            if (previous + 1 === 4) {
                setReadingFiles(false);
            }
            return previous + 1;
        });
    }

    const onMovementLogRead = (result: ParseResult<any>) => {
        const map = readCsvFileIntoMap(result);
        setMovementLogByVehicle(map);
        incrementLoadedFiles();
    }

    const onVehiclesStatesRead = (result: ParseResult<any>) => {
        const map = readCsvFileIntoMap(result);
        setStateLogByVehicle(map);
        incrementLoadedFiles();
    }

    const onRequestLogRead = (result: ParseResult<any>) => {
        setRequestLog(result.data);
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

    const readSimulationLog = (file: File) => {
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
                if (file.name === "movementLog.csv") {
                    Papa.parse(file, {delimiter: ";", complete: onMovementLogRead, dynamicTyping: true, worker: true});
                } else if (file.name === "vehicleStatesLog.csv") {
                    Papa.parse(file, {delimiter: ";", complete: onVehiclesStatesRead, dynamicTyping: true, worker: true});
                } else if (file.name === "requestLog.csv") {
                    Papa.parse(file, {delimiter: ";", complete: onRequestLogRead, dynamicTyping: true, worker: true});
                } else {
                    readSimulationLog(file);
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
                description={`Select your simulation scenario files (${mandatoryFiles.join(", ")}).`}
                label="Simulation scenario"
                accept="application/csv"
                multiple
                error={error}
                onChange={onFileChange}/>
        </Group>
    )
}