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
import { useEffect, useState } from "react";

import { usePeriodicRender } from "@/hooks/usePeriodicRender";

import { useSpansQuery } from "../../api/spanQuery";
import {TimeFrameState} from "../../routes/SpanSearch";
import {SearchFilter} from "../../types/common";
import styles from "./styles";

const A_FEW_SECONDS_AGO_THRESHOLD = 10;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;

interface RefreshButtonProps {
  timeframe: TimeFrameState;
  filters: SearchFilter[];
  isLiveSpansOn: boolean;
  onRefreshTimeframe: () => void;
}

export function RefreshButton({
    timeframe, filters,
  isLiveSpansOn,
  onRefreshTimeframe,
}: RefreshButtonProps) {
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentTime = new Date();
  const timeSinceLastRefresh = lastRefreshed
    ? Math.round((currentTime.getTime() - lastRefreshed.getTime()) / 1000)
    : 0;

  const forceRerender = usePeriodicRender(
    timeSinceLastRefresh,
    calcNextRenderTime
  );

  const { isFetching } = useSpansQuery({ timeframe: timeframe, filters: filters });

  useEffect(() => {
    if (isLiveSpansOn) {
      setLastRefreshed(new Date());
      forceRerender();
    }
  }, [isFetching]);

  if (isRefreshing && !isFetching) {
    setIsRefreshing(false);
  }

  const handleRefresh = () => {
    setLastRefreshed(new Date());
    onRefreshTimeframe();
    const event = new Event("refresh");
    document.dispatchEvent(event);
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
          : `Updated ${calcDisplayString(timeSinceLastRefresh)}`}
      </span>
    </Stack>
  );
}

function calcDisplayString(timeSinceLastRefresh: number): string {
  if (timeSinceLastRefresh < A_FEW_SECONDS_AGO_THRESHOLD) {
    return "a few seconds ago";
  } else if (timeSinceLastRefresh < 60) {
    return "under a minute ago";
  } else if (timeSinceLastRefresh < SECONDS_IN_HOUR) {
    const minutes = Math.round(timeSinceLastRefresh / 60);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (timeSinceLastRefresh < SECONDS_IN_DAY) {
    const hours = Math.round(timeSinceLastRefresh / SECONDS_IN_HOUR);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else {
    const days = Math.round(timeSinceLastRefresh / SECONDS_IN_DAY);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
}

function calcNextRenderTime(timeSinceLastRefresh: number): number {
  if (timeSinceLastRefresh < A_FEW_SECONDS_AGO_THRESHOLD) {
    return A_FEW_SECONDS_AGO_THRESHOLD - timeSinceLastRefresh;
  } else if (timeSinceLastRefresh < 60) {
    return 60 - timeSinceLastRefresh;
  } else if (timeSinceLastRefresh < SECONDS_IN_HOUR) {
    return 60;
  } else if (timeSinceLastRefresh < SECONDS_IN_DAY) {
    return SECONDS_IN_HOUR;
  } else {
    return SECONDS_IN_DAY;
  }
}
