import {ActionIcon, Grid, Group, NumberInput, Slider} from "@mantine/core";
import {IconPlayerPause, IconPlayerPlay} from "@tabler/icons-react";
import React, {useEffect, useState} from "react";
import {useAtom} from "jotai";
import {speedAtom, timeAtom} from "@/state/atoms";
import dayjs from "dayjs";

type SimulationControlsProps = {
    play: () => void;
    pause: () => void;
    stopInterval: () => void;
    playing: boolean;
    scenarioLoaded: boolean;
    start: dayjs.Dayjs | undefined;
    maxTime: number;
}

export default function SimulationControls(props: SimulationControlsProps) {
    const {play, pause, stopInterval, playing, scenarioLoaded, start, maxTime} = props;
    const [time, setTime] = useAtom(timeAtom);
    const [speed, setSpeed] = useAtom(speedAtom);
    const [sliderTime, setSliderTime] = useState(0);

    const playPause = () => {
        if (playing) {
            pause();
        } else {
            play();
        }
    }

    const jumpInTime = (value: number) => {
        pause();
        setTime({time: value, jump: true});
        setSliderTime(value);
    }

    useEffect(() => {
        setSliderTime(time.time);
    }, [time])

    const onSpeedChange = (value: number | '') => {
        if (typeof value === "number") {
            stopInterval();
            setSpeed(value);
            if (playing) {
                play();
            }
        }
    }

    const formatTimeStamp = (value: number): string => {
        if (start !== undefined) {
            let date = start.add(value, "s");
            return date.format("DD.MM.YYYY HH:mm");
        }
        return value.toString();
    }

    return (
        <Grid gutter={"xs"}>
            <Grid.Col span="content">
                <ActionIcon variant={"light"}
                            color={playing ? "blue" : "green"}
                            size={30}
                            onClick={playPause}
                            disabled={!scenarioLoaded}>
                    {playing ? <IconPlayerPause size={16}/> : <IconPlayerPlay size={16}/>}
                </ActionIcon>
            </Grid.Col>
            <Grid.Col span="auto">
                <Slider
                    disabled={!scenarioLoaded}
                    mt={6}
                    defaultValue={0}
                    onChangeEnd={jumpInTime}
                    onChange={setSliderTime}
                    min={0}
                    max={maxTime}
                    value={sliderTime}
                    label={formatTimeStamp}
                    step={1}
                />
            </Grid.Col>
            <Grid.Col span="content">
                <Group spacing={"xs"}>
                    <NumberInput
                        formatter={(value) => value + "x"}
                        styles={{ input: { width: 60, textAlign: 'center', height: 30 } }}
                        value={speed}
                        size={"xs"}
                        onChange={(value) => onSpeedChange(value)}
                        max={50}
                        min={1}
                        step={1}
                        stepHoldDelay={500}
                        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                    />
                </Group>
            </Grid.Col>
        </Grid>
    );
}