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

import create, { StateCreator } from "zustand";
import { persist } from "zustand/middleware"
import { AvailableTag } from "../types/availableTags";


interface RecentlyUsedKeysSlice {
    recentlyUsedKeys: AvailableTag[];
    addRecentlyUsedKey: (tag: AvailableTag) => void;
  }
  
  const MAX_RECENTLY_USED_KEYS = 4;
  const createRecentlyUsedKeysSlice: StateCreator<
  RecentlyUsedKeysSlice,
  [],
  [["zustand/persist", never]]
> = persist((set) => ({
    recentlyUsedKeys: [],
  addRecentlyUsedKey: (tag: AvailableTag) => {
    set((state: RecentlyUsedKeysSlice) => {
      const updatedKeys = [tag, ...state.recentlyUsedKeys.filter(key => key !== tag)].slice(0,MAX_RECENTLY_USED_KEYS);
      return {
          recentlyUsedKeys: updatedKeys,
      };
    });
  },
}), {
  name: 'recently-used-keys',
  getStorage: () => localStorage,
});

  export const recentlyUsedKeysStore = create<
   RecentlyUsedKeysSlice
>()((...set) => ({
  ...createRecentlyUsedKeysSlice(...set)
}));