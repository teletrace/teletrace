/**
 * Copyright 2022 Epsagon
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

import (
	"strings"

	"oss-tracing/pkg/model"
)

func findTableName(key string) string {
	if strings.Contains(key, "span.attributes") {
		return "span_attributes"
	} else if strings.Contains(key, "span.events") {
		return "events"
	} else if strings.Contains(key, "span.event.attributes") {
		return "event_attributes"
	} else if strings.Contains(key, "span.links") {
		return "links"
	} else if strings.Contains(key, "span.link.attributes") {
		return "link_attributes"
	} else if strings.Contains(key, "resource.attributes") {
		return "resource_attributes"
	} else if strings.Contains(key, "scope.attributes") {
		return "scope_attributes"
	} else if strings.Contains(key, "scope") {
		return "scopes"
	} else {
		return "spans"
	}
}

func isValidFilter(filter model.SearchFilter) bool {
	if filter.KeyValueFilter == nil {
		return false
	}
	if _, ok := getSqLiteFields()[string(filter.KeyValueFilter.Key)]; !ok {
		return false
	}
	if _, ok := getSqLiteOperator()[string(filter.KeyValueFilter.Operator)]; !ok {
		return false
	}
	return true
}
