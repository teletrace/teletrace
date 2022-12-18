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
  const [timeSinceLastRefreshString, setTimeSinceLastRefreshString] =
    useState<string>(A_FEW_SECONDS_AGO_STRING);
  const [rerenderInterval, setRerenderInterval] = useState<number>(
    A_FEW_SECONDS_AGO_THRESHOLD * 1000
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const timeSinceLastRefresh = lastRefreshed
        ? Math.round((currentTime.getTime() - lastRefreshed.getTime()) / 1000)
        : 0;

      if (timeSinceLastRefresh < A_FEW_SECONDS_AGO_THRESHOLD) {
        setTimeSinceLastRefreshString(A_FEW_SECONDS_AGO_STRING);
        setRerenderInterval(A_FEW_SECONDS_AGO_THRESHOLD * 1000);
      } else if (timeSinceLastRefresh < 60) {
        setTimeSinceLastRefreshString("under a minute ago");
        setRerenderInterval(50 * 1000);
      } else if (timeSinceLastRefresh < SECONDS_IN_HOUR) {
        const minutes = Math.round(timeSinceLastRefresh / 60);
        setTimeSinceLastRefreshString(`${minutes} minute${
          minutes === 1 ? "" : "s"
        } ago`);
        setRerenderInterval(60 * 1000);
      } else if (timeSinceLastRefresh < SECONDS_IN_DAY) {
        const hours = Math.round(timeSinceLastRefresh / SECONDS_IN_HOUR);
        setTimeSinceLastRefreshString(`${hours} hour${
          hours === 1 ? "" : "s"
        } ago`);
        setRerenderInterval(SECONDS_IN_HOUR * 1000);
      } else {
        const days = Math.round(timeSinceLastRefresh / SECONDS_IN_DAY);
        setTimeSinceLastRefreshString(`${days} day${
            days === 1 ? "" : "s"
        } ago`);
        setRerenderInterval(SECONDS_IN_DAY * 1000);
      }

    }, rerenderInterval);
    return () => clearInterval(interval);
  }, [lastRefreshed, rerenderInterval]);

  const { remove: removeSpansQueryFromCache, isFetching } =
    useSpansQuery(searchRequest);

  if (isRefreshing && !isFetching) {
    setIsRefreshing(false);
  }

  const handleRefresh = () => {
    setLastRefreshed(new Date());
    setTimeSinceLastRefreshString(A_FEW_SECONDS_AGO_STRING)
    setRerenderInterval(0)
    removeSpansQueryFromCache();
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
