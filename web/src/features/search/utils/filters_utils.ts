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

import { Operator } from "../../search/types/common";

const predefinedFilterToId: Record<string, string> = {
    "span.status.code_in": "1",
    "resource.attributes.service.name_in": "2",
    "span.attributes.http.route_in": "3",
    "span.attributes.http.method_in": "4",
    "span.attributes.http.status_code_in": "5",
};

export function getPredefinedFilterId(key: string, operator: Operator): string {
    const id = `${key}_${operator}`;
    return predefinedFilterToId[id];
}

export function getFilterId(key: string, operator: Operator): string {
    const predefinedFilterId = getPredefinedFilterId(key, operator);
    return predefinedFilterId === undefined ? nanoid() : predefinedFilterId;
}