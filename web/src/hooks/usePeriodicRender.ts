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

export function usePeriodicRender(
  timeSinceLastRefresh: number,
  calcNextRenderTime: (timeSinceLastRender: number) => number
): () => void {
  const [periodicRenderTriggerId, setPeriodicRenderTriggerId] =
    useState<string>(uuidv4());

  useEffect(() => {
    const timeout = setTimeout(
      () => setPeriodicRenderTriggerId(uuidv4()),
      calcNextRenderTime(timeSinceLastRefresh) * 1000
    );

    return () => clearTimeout(timeout);
  }, [periodicRenderTriggerId]);

  return () => setPeriodicRenderTriggerId(uuidv4());
}
