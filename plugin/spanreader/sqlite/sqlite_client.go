/**
 * Copyright 2022 Epsagon
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

package sqlite

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"

	"go.uber.org/zap"
)

type sqliteClient struct {
	db *sql.DB
}

func newSqliteClient(logger *zap.Logger, cfg SqliteConfig) (*sqliteClient, error) {
	sqliteConfig := SqliteConfig{
		Path: cfg.Path,
	}
	db, err := sql.Open("sqlite3", sqliteConfig.Path)
	if err != nil {
		logger.Error("Could not connect to sqlite database: %+v", zap.Error(err))
		return nil, err
	}
	return &sqliteClient{
		db: db,
	}, nil
}
