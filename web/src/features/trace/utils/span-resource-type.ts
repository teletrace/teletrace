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

import { InternalSpan } from "@/types/span";

export const RESOURCE_TYPES = ["db.system", "db.type", "messaging.system"];

export function getSpanResourceType(span: Readonly<InternalSpan>): string {
  const spanAttr = span.span.attributes;

  for (const key of RESOURCE_TYPES) {
    if (spanAttr[key]) {
      return spanAttr[key].toString();
    }
  }

  return "";
}
