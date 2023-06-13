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

import create from "zustand";
import { persist } from "zustand/middleware";

import { AvailableTag } from "../types/availableTags";

interface RecentlyUsedKeysState {
  recentlyUsedKeys: AvailableTag[];
  addRecentlyUsedKey: (tag: AvailableTag) => void;
}

const MAX_RECENTLY_USED_KEYS = 3;

export const useRecentlyUsedKeysStore = create<RecentlyUsedKeysState>()(
  persist(
    (set) => ({
      recentlyUsedKeys: [],
      addRecentlyUsedKey: (newTag: AvailableTag) => {
        set((state: RecentlyUsedKeysState) => {
          const recentlyUsedKeysNoDuplicates = state.recentlyUsedKeys.filter(
            (tag) => tag.name !== newTag.name
          );
          const updatedKeys = [newTag, ...recentlyUsedKeysNoDuplicates].slice(
            0,
            MAX_RECENTLY_USED_KEYS
          );

          return {
            recentlyUsedKeys: updatedKeys,
          };
        });
      },
    }),
    {
      name: "teletrace-storage",
    }
  )
);
