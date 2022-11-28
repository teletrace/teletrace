package sqlite

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

func connectToSqliteDb() (*sql.DB, error) {
	const dbName string = "Lupa.db"
	fmt.Println("Database created")
	db, err := sql.Open("sqlite3", dbName)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	fmt.Println("Database connected")
	return db, nil
}

func turnOnForeignKeys(db *sql.DB) error {
	turnOnForeignKeys, err := db.Prepare("PRAGMA foreign_keys = ON")
	if err != nil {
		return err
	}
	turnOnForeignKeys.Exec()
	return nil
}

func createTables(db *sql.DB) error {
	lupaTables := [9]string{
		"CREATE TABLE IF NOT EXISTS scopes ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, version TEXT, dropped_attributes_count INTEGER NOT NULL);",
		"CREATE TABLE IF NOT EXISTS spans ( span_id TEXT PRIMARY KEY, trace_id TEXT NOT NULL, trace_state TEXT, parent_span_id TEXT, name TEXT, kind TEXT, start_time_unix_nano INTEGER NOT NULL, end_time_unix_nano INTEGER NOT NULL, dropped_span_attributes_count INTEGER NOT NULL, span_status_message TEXT NOT NULL, span_status_code TEXT NOT NULL, dropped_resource_attributes_count INTEGER NOT NULL, dropped_events_count INTEGER NOT NULL, dropped_links_count INTEGER NOT NULL, duration INTEGER NOT NULL, ingestion_time_unix_nano INTEGER NOT NULL, instrumentation_scope_id INTEGER NOT NULL, resource_id TEXT NOT NULL, FOREIGN KEY(instrumentation_scope_id) REFERENCES scopes(id) );",
		"CREATE TABLE IF NOT EXISTS events ( id INTEGER PRIMARY KEY AUTOINCREMENT, span_id TEXT NOT NULL, time_unix_nano INTEGER, name TEXT, dropped_attributes_count INTEGER NOT NULL, FOREIGN KEY(span_id) REFERENCES spans(span_id) );",
		"CREATE TABLE IF NOT EXISTS links ( id INTEGER PRIMARY KEY AUTOINCREMENT, span_id TEXT NOT NULL, trace_state TEXT, dropped_attributes_count INTEGER NOT NULL, FOREIGN KEY(span_id) REFERENCES spans(span_id) );",
		"CREATE TABLE IF NOT EXISTS scope_attributes ( scope_id INTEGER NOT NULL, key TEXT NOT NULL, value BLOB, type TEXT, FOREIGN KEY(scope_id) REFERENCES scopes(id) );",
		"CREATE TABLE IF NOT EXISTS span_attributes ( span_id VARCHAR NOT NULL, key TEXT NOT NULL, value BLOB, type TEXT, FOREIGN KEY(span_id) REFERENCES spans(span_id) );",
		"CREATE TABLE IF NOT EXISTS resource_attributes ( resource_id TEXT NOT NULL, key TEXT NOT NULL, value BLOB, type TEXT, FOREIGN KEY(resource_id) REFERENCES spans(resource_id) );",
		"CREATE TABLE IF NOT EXISTS event_attributes ( event_id INTEGER NOT NULL, key TEXT NOT NULL, value BLOB, type TEXT, FOREIGN KEY(event_id) REFERENCES events(id) );",
		"CREATE TABLE IF NOT EXISTS link_attributes ( link_id INTEGER NOT NULL, key TEXT NOT NULL, value BLOB, type TEXT, FOREIGN KEY(link_id) REFERENCES links(id) );",
	}
	for _, table := range lupaTables {
		query, err := db.Prepare(table)
		if err != nil {
			fmt.Println(err)
			return err
		}
		query.Exec()
	}
	fmt.Println("Tables created")
	return nil
}
