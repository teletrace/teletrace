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
	newTag := fmt.Sprintf("%s.leftover", filterTablesNames[0])
	expectedTag := "leftover"
	assert.Equal(t, expectedTag, removeTablePrefixFromDynamicTag(newTag))
}

func TestRemoveTablePrefixFromDynamicTagWithDelimiterInput(t *testing.T) {
	anotherTag := "span.attributes.leftover.extra"
	assert.Equal(t, "leftover.extra", removeTablePrefixFromDynamicTag(anotherTag))
}

func TestRemoveTablePrefixFromDynamicTagWithPrefixNotFromTable(t *testing.T) {
	notFromFilterTableNames := "not.in.list"
	assert.Equal(t, "", removeTablePrefixFromDynamicTag(notFromFilterTableNames))
}

func TestRemoveTablePrefixFromDynamicTagEmptyInput(t *testing.T) {
	assert.Equal(t, "", removeTablePrefixFromDynamicTag(""))
}

func TestConvertSliceOfValuesToString(t *testing.T) {
	sliceOfStrings := []interface{}{"I", "am", "a", "test", "slice"}
	expectedOutoput := "'I','am','a','test','slice'"
	assert.Equal(t, expectedOutoput, convertSliceOfValuesToString(sliceOfStrings))
}

func TestConvertSliceOfValuesToStringNotOnlyStrings(t *testing.T) {
	sliceToTest := []interface{}{"twenty", 2, 4.3, "one", 1}
	expectedString := "'twenty',2,4.3,'one',1"
	assert.Equal(t, expectedString, convertSliceOfValuesToString(sliceToTest))
}

func TestConvertSliceOfValuesToStringEmptyInput(t *testing.T) {
	assert.Equal(t, "", convertSliceOfValuesToString([]interface{}{}))
}
