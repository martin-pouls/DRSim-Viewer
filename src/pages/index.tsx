import BaseLayout from "@/layout/BaseLayout";
import React, {ReactElement, useEffect, useRef, useState} from "react";
import {FitBoundsControlNoSsr, MapNoSsr, VehicleLayerNoSsr} from "@/components/map";
import {
    Divider,
    Grid,
    LoadingOverlay,
    Space
} from "@mantine/core";
import {useAtom} from "jotai";
import {speedAtom, timeAtom} from "@/state/atoms";
import {useViewportSize} from "@mantine/hooks";
import SimulationFileLoader from "@/components/SimulationFileLoader";
import dayjs from "dayjs";
import LogArea from "@/components/LogArea";
import SimulationControls from "@/components/SimulationControls";
import {LatLngTuple} from "leaflet";

export default function Home() {
    const { height } = useViewportSize();
    const mapHeight = height - 250;
    const [time, setTime] = useAtom(timeAtom);
    const [speed,] = useAtom(speedAtom);
    const [movementLogByVehicle, setMovementLogByVehicle] = useState<Map<number, Array<Array<any>>>>(new Map());
    const [stateLogByVehicle, setStateLogByVehicle] = useState<Map<number, Array<Array<any>>>>(new Map());
    const [requestLog, setRequestLog] = useState<Array<Array<any>>>([]);
    const [start, setStart] = useState<dayjs.Dayjs>();
    const [maxTime, setMaxTime] = useState(0);
    const intervalRef = useRef<NodeJS.Timer | undefined>(undefined);
    const [readingFiles, setReadingFiles] = useState(false);
    const [loadedFiles, setLoadedFiles] = useState(0);
    const [playing, setPlaying] = useState<boolean>(false);
    const [logAreaText, setLogAreaText] = useState("");
    const [scenarioLoaded, setScenarioLoaded] = useState(false);
    const [mapBounds, setMapBounds] = useState<LatLngTuple[]>([]);

    const play = () => {
        setPlaying(true);
        intervalRef.current = setInterval(() => {
            setTime((previous) => {
                return {time: previous.time + 1, jump: false}
            });
        }, (1000 / speed));
    }

    const pause = () => {
        setPlaying(false);
        stopInterval();
    }

    const stopInterval = () => {
        if (intervalRef.current !== undefined) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
        }
    }

    const onStartLoading = () => {
        pause();
        setMovementLogByVehicle(new Map());
        setStateLogByVehicle(new Map());
        setRequestLog([]);
        setStart(undefined);
        setTime({time: 0, jump: false});
        setReadingFiles(true);
        setLoadedFiles(0);
        setLogAreaText("");
    }

    useEffect(() => {
        setScenarioLoaded(loadedFiles === 4);
    }, [loadedFiles]);

    useEffect(() => {
        let newBounds: LatLngTuple[] = [];
        for (let key of movementLogByVehicle.keys()) {
            const entry = movementLogByVehicle.get(key);
            if (entry !== undefined) {
                newBounds.push([entry[0][3], entry[0][4]]);
            }
        }
        setMapBounds(newBounds);
    }, [movementLogByVehicle]);

    useEffect(() => {
        if (time.time >= maxTime) {
            stopInterval();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time]);

    return (
        <>
            <LoadingOverlay visible={readingFiles} overlayBlur={2} />
            <SimulationFileLoader setMovementLogByVehicle={setMovementLogByVehicle}
                                  setStateLogByVehicle={setStateLogByVehicle}
                                  startLoadingCallback={onStartLoading}
                                  setLoadedFiles={setLoadedFiles}
                                  setStart={setStart}
                                  setMaxTime={setMaxTime}
                                  setRequestLog={setRequestLog}
                                  setReadingFiles={setReadingFiles}/>
            <Divider my="sm" />

            <Grid gutter={"xs"} columns={5}>
                <Grid.Col span="auto">
                    <div id={"map"} style={{height: mapHeight, width: "100%"}}>
                        <MapNoSsr mapDivId={"map"}
                                  center={[49.01354763997843, 8.404416765869655]}>
                            <VehicleLayerNoSsr movementLogByVehicle={movementLogByVehicle}
                                               stateLogByVehicle={stateLogByVehicle}/>
                            <FitBoundsControlNoSsr bounds={mapBounds}/>
                        </MapNoSsr>
                    </div>
                </Grid.Col>
                <Grid.Col span={1}>
                    <LogArea requestLog={requestLog} start={start} setText={setLogAreaText} text={logAreaText}/>
                </Grid.Col>
            </Grid>

            <Space h="md" />

            <SimulationControls play={play}
                                pause={pause}
                                stopInterval={stopInterval}
                                playing={playing}
                                scenarioLoaded={scenarioLoaded}
                                start={start}
                                maxTime={maxTime}/>
        </>
    )
}

Home.getLayout = function getLayout(page: ReactElement) {
    return (
        <BaseLayout>
            {page}
        </BaseLayout>
    )
}
