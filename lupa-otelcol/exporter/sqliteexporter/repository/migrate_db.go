package repository

import (
	"embed"
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/sqlite3"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	_ "github.com/mattn/go-sqlite3"
)

//go:embed migrations
var migrations embed.FS

func Migrate(dbName string) error {
	driver, err := iofs.New(migrations, "migrations")
	if err != nil {
		return fmt.Errorf("could not read db migrations: %+v", err)
	}

	m, err := migrate.NewWithSourceInstance(
		"iofs", driver, fmt.Sprintf("sqlite3://%s.db", dbName))
	if err != nil {
		return fmt.Errorf("could not create migrate instance: %+v", err)
	}

	if err = m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("could not migrate db: %+v", err)
	}

	return nil
}
