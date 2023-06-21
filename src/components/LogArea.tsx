import dayjs from "dayjs";
import {Textarea} from "@mantine/core";
import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {useViewportSize} from "@mantine/hooks";
import {useAtom} from "jotai";
import {timeAtom} from "@/state/atoms";
import {SimulationTime} from "@/models/time";

type LogAreaProps = {
    requestLog: Array<Array<any>>;
    start: dayjs.Dayjs | undefined;
    text: string;
    setText: Dispatch<SetStateAction<string>>;
}

export default function LogArea(props: LogAreaProps) {
    const {requestLog, start, text, setText} = props;
    const { height } = useViewportSize();
    const textAreaHeight = height - 250;
    const maxRows = textAreaHeight / 24;
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [time,] = useAtom(timeAtom);
    const [logIndex, setLogIndex] = useState(0);

    const logRequest = (entry: Array<any>) => {
        let message = "";
        if (entry[2] == "A") {
            message = `Accepted request ${entry[0]}.`
        } else if (entry[2] == "R") {
            message = `Rejected request ${entry[0]}.`
        } else if (entry[2] == "P") {
            message = `Picked up request ${entry[0]}.`
        } else if (entry[2] == "D") {
            message = `Dropped off request ${entry[0]}.`
        }
        if (start) {
            let date = start.add(entry[1], "s");
            setText((previous) => date.format("DD.MM.YYYY HH:mm\t") + message + "\n" + previous);
        }
    }

    const jumpInTime = (newTime: SimulationTime) => {
        setText("");
        for (let i = 0; i < requestLog.length; ++i) {
            if (requestLog[i][1] > newTime.time) {
                setLogIndex(Math.max(0, i - 1));
                break;
            }
            if (i == requestLog.length - 1) {
                setLogIndex(requestLog.length);
            }
        }
    }

    const stepInTime = (newTime: SimulationTime) => {
        if (logIndex + 1 < requestLog.length - 1 && requestLog[logIndex + 1][1] <= newTime.time) {
            logRequest(requestLog[logIndex + 1]);
            setLogIndex(logIndex + 1);
        }
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
        <Textarea
            ref={textAreaRef}
            minRows={maxRows}
            maxRows={maxRows}
            autosize
            value={text}
        />
    )
}