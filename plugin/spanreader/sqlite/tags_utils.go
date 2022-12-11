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

package sqlitespanreader

var staticTagTypeMap = map[string]string{
	"span.events.name":                    "Str",
	"span.events.droppedAttributesCount":  "Int",
	"span.events.spanId":                  "Str",
	"span.links.spanId":                   "Str",
	"span.links.traceState":               "Str",
	"span.links.droppedAttributesCount":   "Int",
	"scope.name":                          "Str",
	"scope.version":                       "Str",
	"scope.droppedAttributesCount":        "Int",
	"span.spanId":                         "Str",
	"span.traceId":                        "Str",
	"span.traceState":                     "Str",
	"span.parentSpanId":                   "Str",
	"span.name":                           "Str",
	"span.kind":                           "Int",
	"span.startTimeUnixNano":              "Int",
	"span.endTimeUnixNano":                "Int",
	"span.droppedAttributesCount":         "Int",
	"span.status.message":                 "Str",
	"span.status.code":                    "Int",
	"span.droppedResourceAttributesCount": "Int",
	"span.droppedEventsCount":             "Int",
	"span.droppedLinksCount":              "Int",
	"externalFields.durationNano":         "Int",
}

func isDynamicTagsTable(tableName string) bool {
	return tableName == "event_attributes" || tableName == "link_attributes" || tableName == "scope_attributes" || tableName == "span_attributes" || tableName == "resource_attributes"
}
