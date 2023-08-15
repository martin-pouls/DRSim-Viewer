import React, {Dispatch, SetStateAction, useState} from "react";
import {FileInput, Group} from "@mantine/core";

export type StatsFileLoaderProps = {
    setStats: Dispatch<SetStateAction<any | undefined>>;
}

export default function StatsFileLoader(props: StatsFileLoaderProps) {
    const {setStats} = props;
    const mandatoryFile = "simulationStats.json";
    const [error, setError] = useState("");

    const readStatsJson = (file: File) => {
        file.text().then((value: string) => {
            const stats = JSON.parse(value);
            setStats(stats);
        });
    }

    const onFileChange = (file: File) => {
        if (file && file.name === mandatoryFile) {
            setError("");
            readStatsJson(file);
        } else {
            setError("Please select the correct files.")
        }
    }

    return (
        <Group>
            <FileInput
                placeholder=""
                description={`Select your simulation stats file (${mandatoryFile}).`}
                label="Simulation stats"
                accept="application/csv"
                error={error}
                onChange={onFileChange}/>
        </Group>
    )
}