import {Brightness1, Refresh} from "@mui/icons-material";
import {Icon, IconButton, Stack} from "@mui/material";
import {useEffect, useState} from "react";

import {SearchRequest} from "@/features/search";

import {useSpansQuery} from "../../api/spanQuery";
import styles from "./styles";


const A_FEW_SECONDS_AGO_THRESHOLD = 10;
const SECONDS_IN_HOUR= 3600;
const SECONDS_IN_DAY = 86400;

interface RefreshButtonProps {
    searchRequest: SearchRequest;
    isLiveSpansOn: boolean;
}

export function RefreshButton({ searchRequest, isLiveSpansOn }: RefreshButtonProps) {
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
    const [timeSinceLastRefreshString, setTimeSinceLastRefreshString] = useState<string>('a few seconds ago');
    const [rerenderInterval, setRerenderInterval] = useState<number>(A_FEW_SECONDS_AGO_THRESHOLD * 1000);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date();
            const timeSinceLastRefresh = lastRefreshed
                ? Math.round((currentTime.getTime() - lastRefreshed.getTime()) / 1000)
                : 0

            let timeSinceLastRefreshString = '';
            if (timeSinceLastRefresh < 60) {
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


    const { remove: removeSpansQueryFromCache } = useSpansQuery(searchRequest)

    const handleRefresh = () => {
        setLastRefreshed(new Date());
        removeSpansQueryFromCache()
    }

    return (
        <Stack direction="row" sx={{alignItems: "center", height: "40px"}}>
            <Stack direction="row" sx={{width: "30px", justifyContent: "center"}}>
                {
                    isLiveSpansOn ?
                    <Icon>
                        <Brightness1 sx={styles.liveSpansIcon}/>
                    </Icon>
                    :
                    <IconButton onClick={handleRefresh}>
                        <Refresh />
                    </IconButton>
                }
            </Stack>
            <span style={styles.lastUpdatedText}>
                {isLiveSpansOn ? "Streaming ingested spans" : `Updated ${timeSinceLastRefreshString}`}
            </span>
        </Stack>
    );
}
