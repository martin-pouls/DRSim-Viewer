import {atom} from "jotai";
import {SimulationTime} from "@/models/time";

export const timeAtom = atom<SimulationTime>({time: 0, jump: false});
export const speedAtom = atom<number>(20);