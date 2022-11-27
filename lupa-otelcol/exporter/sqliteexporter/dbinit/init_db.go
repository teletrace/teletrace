package dbinit

import (
	"database/sql"
	"fmt"
)

func InitDatabase(db *sql.DB) {
	runCreateTableStatement(db, "PRAGMA foreign_keys = ON;")

	runCreateTableStatement(db, `
		CREATE TABLE IF NOT EXISTS scopes (
		    id INTEGER PRIMARY KEY AUTOINCREMENT,
		    name TEXT,
		    version TEXT,
		    dropped_attributes_count INTEGER NOT NULL);
	`)

	runCreateTableStatement(db, `
 		CREATE TABLE IF NOT EXISTS spans (
			span_id TEXT PRIMARY KEY,
			trace_id TEXT NOT NULL,
			trace_state TEXT,
			parent_span_id TEXT,
			name TEXT,
			kind TEXT,
			start_time_unix_nano INTEGER NOT NULL,
			end_time_unix_nano INTEGER NOT NULL,
			dropped_span_attributes_count INTEGER NOT NULL,
			span_status_message TEXT NOT NULL,
			span_status_code TEXT NOT NULL,
			dropped_resource_attributes_count INTEGER NOT NULL,
			dropped_events_count INTEGER NOT NULL,
			dropped_links_count INTEGER NOT NULL,
			duration INTEGER NOT NULL,
			ingestion_time_unix_nano INTEGER NOT NULL,
			instrumentation_scope_id INTEGER NOT NULL,
			resource_id TEXT NOT NULL,
			FOREIGN KEY(instrumentation_scope_id) REFERENCES scopes(id)
		);
    `)

	runCreateTableStatement(db, `
		CREATE TABLE IF NOT EXISTS events (
		    id INTEGER PRIMARY KEY AUTOINCREMENT,
		    span_id TEXT NOT NULL,
		    time_unix_nano INTEGER,
		    name TEXT,
		    dropped_attributes_count INTEGER NOT NULL,
			FOREIGN KEY(span_id) REFERENCES spans(span_id)
		);
	`)

	runCreateTableStatement(db, `
		CREATE TABLE IF NOT EXISTS links (
		    id INTEGER PRIMARY KEY AUTOINCREMENT,
		    span_id TEXT NOT NULL,
		    trace_state TEXT,
		    dropped_attributes_count INTEGER NOT NULL,
			FOREIGN KEY(span_id) REFERENCES spans(span_id)
		);
	`)

	runCreateTableStatement(db, `
		CREATE TABLE IF NOT EXISTS scope_attributes (
		    scope_id INTEGER NOT NULL,
		    key TEXT NOT NULL,
		    value BLOB,
		    type TEXT,
		    FOREIGN KEY(scope_id) REFERENCES scopes(id)
	  	);
	`)

	runCreateTableStatement(db, `
		CREATE TABLE IF NOT EXISTS span_attributes (
		    span_id TEXT NOT NULL,
		    key TEXT NOT NULL,
		    value BLOB,
		    type TEXT NOT NULL,
		    FOREIGN KEY(span_id) REFERENCES spans(span_id)
	  	);
	`)

	runCreateTableStatement(db, `
		CREATE TABLE IF NOT EXISTS resource_attributes (
		    resource_id TEXT NOT NULL,
		    key TEXT NOT NULL,
		    value BLOB,
		    type TEXT NOT NULL,
		    FOREIGN KEY(resource_id) REFERENCES spans(resource_id)
	  	);
	`)

	runCreateTableStatement(db, `
		CREATE TABLE IF NOT EXISTS event_attributes (
		    event_id INTEGER NOT NULL,
		    key TEXT NOT NULL,
		    value BLOB,
		    type TEXT NOT NULL,
		    FOREIGN KEY(event_id) REFERENCES events(id)
	  	);
	`)

	runCreateTableStatement(db, `
		CREATE TABLE IF NOT EXISTS link_attributes (
		    link_id INTEGER NOT NULL,
		    key TEXT NOT NULL,
		    value BLOB,
		    type TEXT NOT NULL,
		    FOREIGN KEY(link_id) REFERENCES links(id)
	  	);
	`)
}

func runCreateTableStatement(db *sql.DB, queryString string) {
	createTableStatement, err := db.Prepare(queryString)

	if err != nil {
		fmt.Printf("could not prepare statement: %v\n", err)
	}

	if _, err = createTableStatement.Exec(); err != nil {
		fmt.Printf("could not execute statement: %v\n", err)
	}
}
