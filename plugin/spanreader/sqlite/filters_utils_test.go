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

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRemoveTablePrefixFromDynamicTag(t *testing.T) {
	var err error
	newTag := fmt.Sprintf("%s.leftover", filterTablesNames[0])
	expectedTag := "leftover"
	assert.Equal(t, expectedTag, removeTablePrefixFromDynamicTag(newTag))
	assert.Nil(t, err)
}

func TestRemoveTablePrefixFromDynamicTagWithDelimiterInput(t *testing.T) {
	var err error
	anotherTag := "span.attributes.leftover.extra"
	assert.Equal(t, "leftover.extra", removeTablePrefixFromDynamicTag(anotherTag))
	assert.Nil(t, err)
}

func TestRemoveTablePrefixFromDynamicTagWithPrefixNotFromTable(t *testing.T) {
	var err error
	notFromFilterTableNames := "not.in.list"
	assert.Equal(t, "", removeTablePrefixFromDynamicTag(notFromFilterTableNames))
	assert.Nil(t, err)
}

func TestRemoveTablePrefixFromDynamicTagEmptyInput(t *testing.T) {
	var err error
	assert.Equal(t, "", removeTablePrefixFromDynamicTag(""))
	assert.Nil(t, err)
}
