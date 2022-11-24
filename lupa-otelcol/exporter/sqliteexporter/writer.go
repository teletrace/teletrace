package sqliteexporter

import (
	"context"
	"database/sql"
	"fmt"
	"go.opentelemetry.io/collector/pdata/pcommon"
	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/zap"
)

type writer struct {
	logger *zap.Logger
	db     *sql.DB
}

func (w *writer) writeSpan(ctx context.Context, td ptrace.Traces) error {
	tx, err := w.db.Begin()
	if err != nil {
		return fmt.Errorf("Failed to begin transaction: %+v\n", err)
	}

	resourceSpansSlice := td.ResourceSpans()
	for i := 0; i < resourceSpansSlice.Len(); i++ {
		resourceSpans := resourceSpansSlice.At(i)
		scopeSpansSlice := resourceSpans.ScopeSpans()
		for j := 0; j < scopeSpansSlice.Len(); j++ {
			scopeSpans := scopeSpansSlice.At(j)
			scope := scopeSpans.Scope()
			scopeId, err := w.insertScope(tx, scope)
			if err != nil {
				if err := tx.Rollback(); err != nil {
					panic(fmt.Errorf("Failed to rollback transaction: %+v\n", err))
				}
				w.logger.Error(err.Error())
			}

			fmt.Printf("scopeId: %v\n", scopeId)
		}
	}

	return nil
}

func (w *writer) insertScope(tx *sql.Tx, scope pcommon.InstrumentationScope) (*int64, error) {
	insertScopeStmt, err := tx.Prepare(
		"INSERT INTO scopes (name, version, dropped_attributes_count) VALUES ('?', '?', ?)",
	)
	if err != nil {
		return nil, fmt.Errorf("could not prepare statement: %+v\n", err)
	}
	scopeResult, err := insertScopeStmt.Exec(scope.Name(), scope.Version(), scope.DroppedAttributesCount())
	if err != nil {
		return nil, fmt.Errorf("could not execute statement: %v\n", err)
	}

	scopeId, err := scopeResult.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("could not retrieve auto-generated scope id: %v\n", err)
	}
	err = insertScopeStmt.Close()
	if err != nil {
		return nil, fmt.Errorf("could not close statement: %v\n", err)
	}

	return &scopeId, nil
}
