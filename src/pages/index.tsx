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
import ReplayFileLoader from "@/components/loading/ReplayFileLoader";
import dayjs from "dayjs";
import LogArea from "@/components/LogArea";
import SimulationControls from "@/components/SimulationControls";
import {LatLngTuple} from "leaflet";

export default function Home() {
    const { height } = useViewportSize();
    const mapHeight = height - 250;
    const [time, setTime] = useAtom(timeAtom);
    const [speed,] = useAtom(speedAtom);
    const [movementReplayByVehicle, setMovementReplayByVehicle] = useState<Map<number, Array<Array<any>>>>(new Map());
    const [stateReplayByVehicle, setStateReplayByVehicle] = useState<Map<number, Array<Array<any>>>>(new Map());
    const [requestReplay, setRequestReplay] = useState<Array<Array<any>>>([]);
    const [start, setStart] = useState<dayjs.Dayjs>();
    const [maxTime, setMaxTime] = useState(0);
    const intervalRef = useRef<NodeJS.Timer | undefined>(undefined);
    const [readingFiles, setReadingFiles] = useState(false);
    const [numLoadedFiles, setNumLoadedFiles] = useState(0);
    const [playing, setPlaying] = useState<boolean>(false);
    const [logAreaText, setLogAreaText] = useState("");
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
        setMovementReplayByVehicle(new Map());
        setStateReplayByVehicle(new Map());
        setRequestReplay([]);
        setStart(undefined);
        setTime({time: 0, jump: false});
        setReadingFiles(true);
        setNumLoadedFiles(0);
        setLogAreaText("");
    }

    useEffect(() => {
        if (numLoadedFiles === 4) {
            setReadingFiles(false);
        }
    }, [numLoadedFiles]);

    useEffect(() => {
        let newBounds: LatLngTuple[] = [];
        for (let key of movementReplayByVehicle.keys()) {
            const entry = movementReplayByVehicle.get(key);
            if (entry !== undefined) {
                newBounds.push([entry[0][3], entry[0][4]]);
            }
        }
        setMapBounds(newBounds);
    }, [movementReplayByVehicle]);

    useEffect(() => {
        if (time.time >= maxTime) {
            stopInterval();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time]);

    return (
        <>
            <LoadingOverlay visible={readingFiles} overlayBlur={2} />

            <ReplayFileLoader setMovementReplayByVehicle={setMovementReplayByVehicle}
                              setStateReplayByVehicle={setStateReplayByVehicle}
                              startLoadingCallback={onStartLoading}
                              setNumLoadedFiles={setNumLoadedFiles}
                              setStart={setStart}
                              setMaxTime={setMaxTime}
                              setRequestReplay={setRequestReplay}/>
            <Divider my="sm" />

            <Grid gutter={"xs"} columns={5}>
                <Grid.Col span="auto">
                    <div id={"map"} style={{height: mapHeight, width: "100%"}}>
                        <MapNoSsr mapDivId={"map"}
                                  center={[49.01354763997843, 8.404416765869655]}>
                            <VehicleLayerNoSsr movementReplayByVehicle={movementReplayByVehicle}
                                               stateReplayByVehicle={stateReplayByVehicle}/>
                            <FitBoundsControlNoSsr bounds={mapBounds}/>
                        </MapNoSsr>
                    </div>
                </Grid.Col>
                <Grid.Col span={1}>
                    <LogArea requestReplay={requestReplay} start={start} setText={setLogAreaText} text={logAreaText}/>
                </Grid.Col>
            </Grid>

            <Space h="md" />

            <SimulationControls play={play}
                                pause={pause}
                                stopInterval={stopInterval}
                                playing={playing}
                                scenarioLoaded={numLoadedFiles === 4}
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
