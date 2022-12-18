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

type Set struct {
	setMap map[string]bool
}

// NewSet creates a new set
func NewSet() *Set {
	return &Set{make(map[string]bool)}
}

// Add adds an element to the set
func (set *Set) Add(s string) {
	set.setMap[s] = true
}

// Remove removes an element from the set
func (set *Set) Remove(s string) {
	delete(set.setMap, s)
}

// Contains returns true if the set contains the given element, or false otherwise
func (set *Set) Contains(s string) bool {
	_, ok := set.setMap[s]
	return ok
}

// Size returns the number of elements in the set
func (set *Set) Size() int {
	return len(set.setMap)
}

func (set *Set) Values() []string {
	values := make([]string, 0, set.Size())
	for key := range set.setMap {
		values = append(values, key)
	}
	return values
}
