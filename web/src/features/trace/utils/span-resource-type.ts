import { Attributes } from "@/types/span";

export const RESOURCE_TYPES = ["db.system", "db.type", "messaging.system"];

export function getSpanResourceType(spanAttr: Readonly<Attributes>): string {
  const resourceTypeSet = new Set<string>(RESOURCE_TYPES);

  for (const key of resourceTypeSet) {
    if (spanAttr[key]) return spanAttr[key].toString();
  }

  return "";
}
