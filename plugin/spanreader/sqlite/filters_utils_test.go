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

func TestRemoveTablePrefixFromDynamicTagFromTagWithSpecialCharacters(t *testing.T) {
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
func TestRemoveTablePrefixFromDynamicTagFromTagEmptyInput(t *testing.T) {
	var err error
	assert.Equal(t, "", removeTablePrefixFromDynamicTag(""))
	assert.Nil(t, err)
}
