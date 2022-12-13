import {Refresh} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import {useEffect, useRef, useState} from "react";

import styles from "./styles";

const A_FEW_SECONDS_AGO_THRESHOLD = 10;
const SECONDS_IN_HOUR= 3600;
const SECONDS_IN_DAY = 86400;

export function RefreshButton() {
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
    const [timeSinceLastRefreshString, setTimeSinceLastRefreshString] = useState<string>('a few seconds ago');
    const [rerenderInterval, setRerenderInterval] = useState<number>(A_FEW_SECONDS_AGO_THRESHOLD * 1000);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date();
            const timeSinceLastRefresh = lastRefreshed
                ? Math.round((currentTime.getTime() - lastRefreshed.getTime()) / 1000)
                : 0

            console.log(timeSinceLastRefresh)
            let timeSinceLastRefreshString = '';
            if (timeSinceLastRefresh < A_FEW_SECONDS_AGO_THRESHOLD) {
                timeSinceLastRefreshString = 'a few seconds ago';
            } else if (timeSinceLastRefresh < 60) {
                timeSinceLastRefreshString = 'under a minute ago';
                setRerenderInterval(50 * 1000)
            } else if (timeSinceLastRefresh < SECONDS_IN_HOUR) {
                const minutes = Math.round(timeSinceLastRefresh / 60);
                timeSinceLastRefreshString = `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
                setRerenderInterval(60 * 1000)
            } else if (timeSinceLastRefresh < SECONDS_IN_DAY) {
                const hours = Math.round(timeSinceLastRefresh / SECONDS_IN_HOUR);
                timeSinceLastRefreshString = `${hours} hour${hours === 1 ? '' : 's'} ago`;
                setRerenderInterval(SECONDS_IN_HOUR * 1000)
            }

            setTimeSinceLastRefreshString(timeSinceLastRefreshString)
        }, rerenderInterval);
        return () => clearInterval(interval);
    }, [lastRefreshed, rerenderInterval]);


    return (
        <>
            <IconButton onClick={() => setLastRefreshed(new Date())}>
                <Refresh />
            </IconButton>
            <span style={styles.lastUpdatedText}>
                Updated {timeSinceLastRefreshString}
            </span>
        </>
    );
}