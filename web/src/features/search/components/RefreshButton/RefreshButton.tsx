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

import {useRefreshRender} from "@/features/search/components/RefreshButton/useRefreshRender";
import { useSpansQuery } from "../../api/spanQuery";
import { SearchRequest } from "../../types/spanQuery";
import styles from "./styles";

const A_FEW_SECONDS_AGO_STRING = "a few seconds ago";

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
  const [timeSinceLastRefreshString, setTimeSinceLastRefreshString] = useRefreshRender(lastRefreshed)

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
