PRAGMA foreign_keys = ON;
PRAGMA wal_autocheckpoint = 1000;

CREATE TABLE IF NOT EXISTS scopes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      version TEXT,
      dropped_attributes_count INTEGER NOT NULL
);

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
     FOREIGN KEY(instrumentation_scope_id) REFERENCES scopes(id)
);

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    span_id TEXT NOT NULL,
    time_unix_nano INTEGER,
    name TEXT,
    dropped_attributes_count INTEGER NOT NULL,
    FOREIGN KEY(span_id) REFERENCES spans(span_id)
);

CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    span_id TEXT NOT NULL,
    trace_state TEXT,
    dropped_attributes_count INTEGER NOT NULL,
    FOREIGN KEY(span_id) REFERENCES spans(span_id)
);

CREATE TABLE IF NOT EXISTS scope_attributes (
    scope_id INTEGER NOT NULL,
    key TEXT NOT NULL,
    value BLOB,
    type TEXT,
    FOREIGN KEY(scope_id) REFERENCES scopes(id)
);

CREATE TABLE IF NOT EXISTS span_attributes (
    span_id TEXT NOT NULL,
    key TEXT NOT NULL,
    value BLOB,
    type TEXT NOT NULL,
    FOREIGN KEY(span_id) REFERENCES spans(span_id)
);

CREATE TABLE IF NOT EXISTS resource_attributes (
    resource_id TEXT NOT NULL PRIMARY KEY ON CONFLICT IGNORE,
    key TEXT NOT NULL,
    value BLOB,
    type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS event_attributes (
    event_id INTEGER NOT NULL,
    key TEXT NOT NULL,
    value BLOB,
    type TEXT NOT NULL,
    FOREIGN KEY(event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS link_attributes (
    link_id INTEGER NOT NULL,
    key TEXT NOT NULL,
    value BLOB,
    type TEXT NOT NULL,
    FOREIGN KEY(link_id) REFERENCES links(id)
);

CREATE TABLE IF NOT EXISTS span_resource_attributes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    span_id TEXT,
    resource_attribute_id TEXT,
    FOREIGN KEY(span_id) REFERENCES spans(span_id),
    FOREIGN KEY(resource_attribute_id) REFERENCES resource_attributes(resource_id)
);

CREATE INDEX IF NOT EXISTS start_time_index
ON spans (start_time_unix_nano);

CREATE INDEX IF NOT EXISTS end_time_index
ON spans (end_time_unix_nano);

CREATE INDEX IF NOT EXISTS duration_index
ON spans (duration);
