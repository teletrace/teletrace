import create, {StateCreator} from 'zustand';

import {getCurrentTimestamp, msToNanoSec} from "@/utils/format";

export type TimeFrameState = {
    startTimeUnixNanoSec: number;
    endTimeUnixNanoSec: number;
    isRelative: boolean;
};

interface TimeframeSlice {
    currentTimeframe: TimeFrameState
    setRelativeTimeframe: (durationInNanoSec: number) => void,
    setAbsoluteTimeframe: (newStartTimeUnixNanoSec: number, newEndTimeUnixNanoSec: number) => void,
}

interface LiveSpansSlice{
    isOn: boolean;
    interval: number;
    toggle: (absolute?: boolean) => void;
}

const createTimeframeSlice: StateCreator<TimeframeSlice> = (set) => ({
    currentTimeframe: {
        startTimeUnixNanoSec: (getCurrentTimestamp() - msToNanoSec(3600 * 1000)),
        endTimeUnixNanoSec: getCurrentTimestamp(),
        isRelative: true
    },
    setRelativeTimeframe: (durationInMillis: number) => {
        set({
            currentTimeframe: {
                startTimeUnixNanoSec: getCurrentTimestamp() - msToNanoSec(msToNanoSec(durationInMillis)),
                endTimeUnixNanoSec: getCurrentTimestamp(),
                isRelative: true
            },
        });
    },
    setAbsoluteTimeframe: (newStartTimeUnixNanoSec: number, newEndTimeUnixNanoSec: number) => {
        set({
            currentTimeframe: {
                startTimeUnixNanoSec: newStartTimeUnixNanoSec,
                endTimeUnixNanoSec: newEndTimeUnixNanoSec,
                isRelative: false
            },
        });
    },
});

const createLiveSpansSlice: StateCreator<LiveSpansSlice> = (set) => ({
   isOn: false,
   interval: 2000,
   toggle: (absoluteValue?: boolean) => absoluteValue ? set({ isOn: absoluteValue }) : set(state => ({isOn: !state.isOn}))
});

export const useSpanSearchStore = create<TimeframeSlice & LiveSpansSlice>()((...set) => ({
    ...createTimeframeSlice(...set),
    ...createLiveSpansSlice(...set),
}));