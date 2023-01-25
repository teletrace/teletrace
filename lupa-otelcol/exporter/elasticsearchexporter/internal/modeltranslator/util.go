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

package modeltranslator

import (
	"sort"
	"strings"

	internalspanv1 "github.com/epsagon/lupa/model/internalspan/v1"
)

func dedupAttributes(attrs internalspanv1.Attributes) internalspanv1.Attributes {
	dedupedAttrs := internalspanv1.Attributes{}

	if len(attrs) == 0 {
		return attrs
	}

	keys := make([]string, 0, len(attrs))

	for k := range attrs {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	prev := ""
	var attr string
	for _, attr = range keys {
		if prev != "" {
			if len(prev) < len(attr) && strings.HasPrefix(attr, prev) && attr[len(prev)] == '.' {
				dedupedAttrs[prev+".value"] = attrs[attr]
			} else {
				dedupedAttrs[prev] = attrs[attr]
			}
		}
		prev = attr
	}

	lastKey := keys[len(keys)-1]
	dedupedAttrs[lastKey] = attrs[lastKey]

	return dedupedAttrs
}
