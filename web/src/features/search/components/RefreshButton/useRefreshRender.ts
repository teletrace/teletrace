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

import { useEffect, useState } from "react";

const A_FEW_SECONDS_AGO_STRING = "a few seconds ago";
const A_FEW_SECONDS_AGO_THRESHOLD = 10;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;

export function useRefreshRender(
  lastRefreshed: Date
): [string, (timeSinceLastRefreshString: string) => void] {
  const [timeSinceLastRefreshString, setTimeSinceLastRefreshString] =
    useState<string>(A_FEW_SECONDS_AGO_STRING);

  useEffect(() => {
    const currentTime = new Date();
    const timeSinceLastRefresh = lastRefreshed
      ? Math.round((currentTime.getTime() - lastRefreshed.getTime()) / 1000)
      : 0;
    const nextRender = calcNextRender(timeSinceLastRefresh);

    const timeout = setTimeout(() => {
      setTimeSinceLastRefreshString(nextRender.displayString);
    }, nextRender.timeout * 1000);

    return () => clearTimeout(timeout);
  }, [timeSinceLastRefreshString]);

  return [timeSinceLastRefreshString, setTimeSinceLastRefreshString];
}

function calcNextRender(timeSinceLastRefresh: number): {
  displayString: string;
  timeout: number;
} {
  if (timeSinceLastRefresh < A_FEW_SECONDS_AGO_THRESHOLD) {
    return {
      displayString: "under a minute ago",
      timeout: A_FEW_SECONDS_AGO_THRESHOLD - timeSinceLastRefresh,
    };
  } else if (timeSinceLastRefresh < 60) {
    return {
      displayString: "a minute ago",
      timeout: 60 - timeSinceLastRefresh,
    };
  } else if (timeSinceLastRefresh < SECONDS_IN_HOUR) {
    const minutes = Math.round(timeSinceLastRefresh / 60) + 1;
    return {
      displayString: `${minutes} minute${minutes === 1 ? "" : "s"} ago`,
      timeout: 60,
    };
  } else if (timeSinceLastRefresh < SECONDS_IN_DAY) {
    const hours = Math.ceil(timeSinceLastRefresh / SECONDS_IN_HOUR);
    return {
      displayString: `${hours} hour${hours === 1 ? "" : "s"} ago`,
      timeout: SECONDS_IN_HOUR,
    };
  } else {
    const days = Math.round(timeSinceLastRefresh / SECONDS_IN_DAY);
    return {
      displayString: `${days} day${days === 1 ? "" : "s"} ago`,
      timeout: SECONDS_IN_DAY,
    };
  }
}
