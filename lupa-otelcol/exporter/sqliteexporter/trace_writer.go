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

package sqliteexporter

import (
	"crypto/md5"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"sort"

	"go.opentelemetry.io/collector/pdata/pcommon"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/zap"
)

func (exporter *sqliteTracesExporter) writeTraces(traces ptrace.Traces) error {
	tx, err := exporter.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %+v\n", err)
	}

	resourceSpansSlice := traces.ResourceSpans()
	for i := 0; i < resourceSpansSlice.Len(); i++ {
		resourceSpans := resourceSpansSlice.At(i)
		resourceAttributes := resourceSpans.Resource().Attributes()
		resourceId, err := hashAttributes(resourceAttributes) // Generating a resource identifier to store with each span
		if err != nil || resourceId == "" {
			exporter.logger.Error("failed to hash resource attributes", zap.NamedError("reason", err))
			return err
		}
		if err := exporter.writeResourceSpans(resourceSpans, tx, resourceId, err); err != nil {
			if err := tx.Rollback(); err != nil {
				exporter.logger.Fatal("failed to rollback transaction", zap.NamedError("reason", err))
				panic(err)
			}
			return err
		}
	}

	if err := tx.Commit(); err != nil {
		exporter.logger.Error("failed to commit transaction", zap.NamedError("reason", err))
		return err
	}

	return nil
}

func (exporter *sqliteTracesExporter) writeResourceSpans(
	resourceSpans ptrace.ResourceSpans, tx *sql.Tx, resourceId string, err error) error {
	droppedResourceAttributesCount := resourceSpans.Resource().DroppedAttributesCount()
	if err := exporter.writeAttributes(tx, resourceSpans.Resource().Attributes(), Resource, resourceId); err != nil {
		return err
	}
	scopeSpansSlice := resourceSpans.ScopeSpans()
	for j := 0; j < scopeSpansSlice.Len(); j++ {
		scopeSpans := scopeSpansSlice.At(j)
		if err = exporter.writeScope(scopeSpans, tx, droppedResourceAttributesCount, resourceId); err != nil {
			return err
		}
	}

	return nil
}

func (exporter *sqliteTracesExporter) writeScope(
	scopeSpans ptrace.ScopeSpans, tx *sql.Tx, droppedResourceAttributesCount uint32, resourceId string) error {
	scope := scopeSpans.Scope()
	scopeId, err := insertScope(tx, scope)
	if err != nil || scopeId == 0 {
		exporter.logger.Error("could not insert scope", zap.NamedError("reason", err))
		return err
	}

	if err := exporter.writeAttributes(tx, scope.Attributes(), Scope, scopeId); err != nil {
		return err
	}

	spanSlice := scopeSpans.Spans()
	for k := 0; k < spanSlice.Len(); k++ {
		span := spanSlice.At(k)
		if err := exporter.writeSpan(tx, span, droppedResourceAttributesCount, resourceId, scopeId); err != nil {
			return err
		}
	}

	return nil
}

func (exporter *sqliteTracesExporter) writeSpanEvents(
	tx *sql.Tx, span ptrace.Span, spanId string) error {
	spanEventSlice := span.Events()
	if spanEventSlice.Len() < 0 {
		for i := 0; i < spanEventSlice.Len(); i++ {
			spanEvent := spanEventSlice.At(i)
			eventId, err := insertEvent(tx, spanEvent, spanId)
			if err != nil || eventId == 0 {
				exporter.logger.Error("could not insert event", zap.NamedError("reason", err))
				return err
			}

			if err := exporter.writeAttributes(tx, spanEvent.Attributes(), Event, eventId); err != nil {
				return err
			}
		}
	} else {
		eventId, err := insertEmptyEvent(tx, spanId)
		if err != nil || eventId == 0 {
			exporter.logger.Error("could not insert event", zap.NamedError("reason", err))
			return err
		}
		if err := insertEmptyAttribute(tx, Event, eventId); err != nil {
			return err
		}
	}
	return nil
}

func (exporter *sqliteTracesExporter) writeSpan(
	tx *sql.Tx, span ptrace.Span, droppedResourceAttributesCount uint32, resourceId string, scopeId int64) error {
	spanId := span.SpanID().HexString()
	if err := insertSpan(tx, span, spanId, droppedResourceAttributesCount, resourceId, scopeId); err != nil {
		exporter.logger.Error("could not insert span", zap.NamedError("reason", err))
		return err
	}

	if err := exporter.writeAttributes(tx, span.Attributes(), Span, spanId); err != nil {
		return err
	}
	if err := exporter.writeSpanEvents(tx, span, spanId); err != nil {
		return err
	}
	spanEventSlice := span.Events()
	if spanEventSlice.Len() > 0 {
		for i := 0; i < spanEventSlice.Len(); i++ {
			spanEvent := spanEventSlice.At(i)
			eventId, err := insertEvent(tx, spanEvent, spanId)
			if err != nil || eventId == 0 {
				exporter.logger.Error("could not insert event", zap.NamedError("reason", err))
				return err
			}

			if err := exporter.writeAttributes(tx, spanEvent.Attributes(), Event, eventId); err != nil {
				return err
			}
		}
	} else {
		eventId, err := insertEmptyEvent(tx, spanId)
		if err != nil || eventId == 0 {
			exporter.logger.Error("could not insert event", zap.NamedError("reason", err))
			return err
		}
		if err := exporter.writeAttributes(tx, spanEvent.Attributes(), Event, eventId); err != nil {
			return err
		}
	}

	spanLinkSlice := span.Links()
	for i := 0; i < spanLinkSlice.Len(); i++ {
		spanLink := spanLinkSlice.At(i)
		linkId, err := insertLink(tx, spanLink, spanId)
		if err != nil {
			exporter.logger.Error("could not insert event", zap.NamedError("reason", err))
			return err
		}

		if err := exporter.writeAttributes(tx, spanLink.Attributes(), Link, linkId); err != nil {
			return err
		}
	}

	return nil
}

func (exporter *sqliteTracesExporter) writeAttributes(
	tx *sql.Tx, attributes pcommon.Map, attributeKind AttributeKind, id any) error {
	for key := range attributes.AsRaw() {
		value, _ := attributes.Get(key)

		finalValue := value.AsRaw()
		if value.Type() == pcommon.ValueTypeSlice { // Temporary handling for array values
			finalValue = value.AsString()
		}

		if err := insertAttribute(tx, attributeKind, id, key, finalValue, value.Type().String()); err != nil {
			exporter.logger.Error(
				"could not insert attribute",
				zap.String("attributeKind", string(attributeKind)),
				zap.String("attributeKey", key),
				zap.String("attributeValue", value.AsString()),
				zap.NamedError("reason", err))
			return err
		}
	}

	return nil
}

func hashAttributes(attributes pcommon.Map) (string, error) {
	// Golang's map implementation deliberately randomizes the order of the keys, so in order to generate a consistent
	// hash, the keys should be sorted before iterating over the map
	sortedKeys := make([]string, 0, len(attributes.AsRaw()))
	for key := range attributes.AsRaw() {
		sortedKeys = append(sortedKeys, key)
	}

	sort.Strings(sortedKeys)

	hash := md5.New()
	sortedAttributes := make(map[string]string)
	for _, key := range sortedKeys {
		value, exists := attributes.Get(key)
		if !exists {
			return "", fmt.Errorf("failed to retrieve value for '%s'", key)
		}

		sortedAttributes[key] = value.AsString()

	}

	attributesAsJson, err := json.Marshal(sortedAttributes)
	if err != nil {
		return "", errors.New("failed to serialize attributes")
	}
	hash.Write(attributesAsJson)

	src := hash.Sum(nil)
	dst := make([]byte, hex.EncodedLen(len(src)))
	hex.Encode(dst, src)
	return string(dst), nil
}
