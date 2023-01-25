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

import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

/**
 * Allows a component to periodically rerender without any particular state change
 * @param timeSinceLastRender The time elapsed since the last render
 * @param calcNextRenderTime A callback function that calculates the amount of time until the next render
 * @returns A callback function that resets the periodic render
 */
export function usePeriodicRender(
  timeSinceLastRender: number,
  calcNextRenderTime: (timeSinceLastRender: number) => number
): () => void {
  const [periodicRenderTriggerId, setPeriodicRenderTriggerId] =
    useState<string>(nanoid());

  useEffect(() => {
    const timeout = setTimeout(
      () => setPeriodicRenderTriggerId(nanoid()),
      calcNextRenderTime(timeSinceLastRender) * 1000
    );

    return () => clearTimeout(timeout);
  }, [periodicRenderTriggerId]);

  return () => setPeriodicRenderTriggerId(nanoid());
}
