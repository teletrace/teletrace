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
