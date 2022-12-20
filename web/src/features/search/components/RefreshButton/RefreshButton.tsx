/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Brightness1, Refresh } from "@mui/icons-material";
import { CircularProgress, Icon, IconButton, Stack } from "@mui/material";
import {useEffect, useState} from "react";

import { useSpansQuery } from "../../api/spanQuery";
import { SearchRequest } from "../../types/spanQuery";
import styles from "./styles";

const A_FEW_SECONDS_AGO_STRING = "a few seconds ago";
const A_FEW_SECONDS_AGO_THRESHOLD = 10;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;

interface RefreshButtonProps {
  searchRequest: SearchRequest;
  isLiveSpansOn: boolean;
}

export function RefreshButton({
  searchRequest,
  isLiveSpansOn,
}: RefreshButtonProps) {
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeSinceLastRefreshString, setTimeSinceLastRefreshString] = useState<string>(A_FEW_SECONDS_AGO_STRING);

  useEffect(() => {
      const currentTime = new Date();
      const timeSinceLastRefresh = lastRefreshed
          ? Math.round((currentTime.getTime() - lastRefreshed.getTime()) / 1000)
          : 0;
      const timeoutDuration = calculateTimout(timeSinceLastRefresh) * 1000;

      const timeout = setTimeout(() => {
        setTimeSinceLastRefreshString(calculateNextTimeString(timeSinceLastRefresh));
      }, timeoutDuration);

      return () => clearTimeout(timeout)
  }, [timeSinceLastRefreshString]);

  const { remove: removeSpansQueryFromCache, isFetching } =
    useSpansQuery(searchRequest);

  if (isRefreshing && !isFetching) {
    setIsRefreshing(false);
  }

  const handleRefresh = () => {
    setLastRefreshed(new Date());
    setTimeSinceLastRefreshString(A_FEW_SECONDS_AGO_STRING)
    removeSpansQueryFromCache();
    const event = new Event("refresh");
    document.dispatchEvent(event)
    setIsRefreshing(true);
  };

  return (
    <Stack direction="row" sx={styles.container}>
      <Stack direction="row" sx={styles.iconWrapper}>
        {isLiveSpansOn ? (
          <Icon>
            <Brightness1 sx={styles.liveSpansIcon} />
          </Icon>
        ) : isRefreshing ? (
          <Icon>
            <CircularProgress sx={styles.refreshingIcon} />
          </Icon>
        ) : (
          <IconButton onClick={handleRefresh}>
            <Refresh />
          </IconButton>
        )}
      </Stack>
      <span style={styles.refreshStatusText}>
        {isLiveSpansOn
          ? "Streaming ingested spans"
          : `Updated ${timeSinceLastRefreshString}`}
      </span>
    </Stack>
  );
}

function calculateTimout(timeSinceLastRefresh: number): number {
    if (timeSinceLastRefresh < A_FEW_SECONDS_AGO_THRESHOLD) {
        return A_FEW_SECONDS_AGO_THRESHOLD - timeSinceLastRefresh;
    } else if (timeSinceLastRefresh < 60) {
        return 60 - timeSinceLastRefresh;
    } else if (timeSinceLastRefresh < SECONDS_IN_HOUR) {
        return 60;
    } else if (timeSinceLastRefresh < SECONDS_IN_DAY) {
        return SECONDS_IN_HOUR
    } else {
        return SECONDS_IN_DAY;
    }

}
function calculateNextTimeString(timeSinceLastRefresh: number): string {
    if (timeSinceLastRefresh < A_FEW_SECONDS_AGO_THRESHOLD) {
        return "under a minute ago";
    } else if (timeSinceLastRefresh < 60) {
        return "a minute ago";
    } else if (timeSinceLastRefresh < SECONDS_IN_HOUR) {
        const minutes = Math.round(timeSinceLastRefresh / 60) + 1;
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
    } else if (timeSinceLastRefresh < SECONDS_IN_DAY) {
        const hours = Math.ceil(timeSinceLastRefresh / SECONDS_IN_HOUR);
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else {
        const days = Math.round(timeSinceLastRefresh / SECONDS_IN_DAY);
        return `${days} day${days === 1 ? "" : "s"} ago`;
    }
}