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
	"embed"
	"fmt"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/sqlite3"
	"github.com/golang-migrate/migrate/v4/source/iofs"
)

//go:embed migrations
var migrations embed.FS

func migrateSchema(dbName string) error {
	driver, err := iofs.New(migrations, "migrations")
	if err != nil {
		return fmt.Errorf("could not read db migrations: %+v", err)
	}

	m, err := migrate.NewWithSourceInstance(
		"iofs", driver, fmt.Sprintf("sqlite3://%s?_journal_mode=WAL", dbName))
	if err != nil {
		return fmt.Errorf("could not create migrate instance: %+v", err)
	}

	if err = m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("could not migrate db: %+v", err)
	}

	return nil
}
