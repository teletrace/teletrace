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

import "fmt"

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
	"span.startTimeUnixMilli":             NumberType,
	"span.endTimeUnixMilli":               NumberType,
	"span.droppedAttributesCount":         NumberType,
	"span.status.message":                 TextType,
	"span.status.code":                    NumberType,
	"span.droppedResourceAttributesCount": NumberType,
	"span.droppedEventsCount":             NumberType,
	"span.droppedLinksCount":              NumberType,
	"externalFields.durationUnixMilli":    NumberType,
}

var tablesTypeMap = map[string]bool{
	"span_attributes":          true,
	"events":                   false,
	"event_attributes":         true,
	"links":                    false,
	"link_attributes":          true,
	"resource_attributes":      true,
	"span_resource_attributes": true,
	"scope_attributes":         true,
	"scopes":                   false,
	"spans":                    false,
}

func isDynamicTagsTable(tableName string) bool {
	return tablesTypeMap[tableName]
}

func createDynamicTagValueField(table string) string {
	return fmt.Sprintf("%s.value", table)
}
