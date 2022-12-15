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

const (
	TextType   = "Str"
	NumberType = "Int"
)

var staticTagTypeMap = map[string]string{
	"span.events.name":                    TextType,
	"span.events.droppedAttributesCount":  NumberType,
	"span.events.spanId":                  TextType,
	"span.links.spanId":                   TextType,
	"span.links.traceState":               TextType,
	"span.links.droppedAttributesCount":   NumberType,
	"scope.name":                          TextType,
	"scope.version":                       TextType,
	"scope.droppedAttributesCount":        NumberType,
	"span.spanId":                         TextType,
	"span.traceId":                        TextType,
	"span.traceState":                     TextType,
	"span.parentSpanId":                   TextType,
	"span.name":                           TextType,
	"span.kind":                           NumberType,
	"span.startTimeUnixNano":              NumberType,
	"span.endTimeUnixNano":                NumberType,
	"span.droppedAttributesCount":         NumberType,
	"span.status.message":                 TextType,
	"span.status.code":                    NumberType,
	"span.droppedResourceAttributesCount": NumberType,
	"span.droppedEventsCount":             NumberType,
	"span.droppedLinksCount":              NumberType,
	"externalFields.durationNano":         NumberType,
}

var dynamicTables = []string{
	"event_attributes",
	"link_attributes",
	"scope_attributes",
	"span_attributes",
	"resource_attributes",
}

func isDynamicTagsTable(tableName string) bool {
	for _, t := range dynamicTables {
		if t == tableName {
			return true
		}
	}
	return false
}
