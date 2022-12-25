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
import { v4 as uuidv4 } from "uuid";

import {
  A_FEW_SECONDS_AGO_THRESHOLD,
  SECONDS_IN_DAY,
  SECONDS_IN_HOUR,
} from "./constants";

export function useRefreshRender(timeSinceLastRefresh: number): () => void {
  const [triggerDisplayChange, setTriggerDisplayChange] = useState<string>(
    uuidv4()
  );

  useEffect(() => {
    console.log("Effect triggered");
    const timeout = setTimeout(
      () => setTriggerDisplayChange(uuidv4()),
      calcNextRender(timeSinceLastRefresh) * 1000
    );

    return () => clearTimeout(timeout);
  }, [triggerDisplayChange]);

  return () => setTriggerDisplayChange(uuidv4());
}

function calcNextRender(timeSinceLastRefresh: number): number {
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
