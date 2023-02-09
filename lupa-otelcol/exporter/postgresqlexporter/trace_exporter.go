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

package postgresqlexporter

import (
	"context"
	"database/sql"
	"fmt"

	"go.opentelemetry.io/collector/pdata/ptrace"
	"go.uber.org/zap"
)

type postgresqlTracesExporter struct {
	logger *zap.Logger
	db     *sql.DB
}

func newTracesExporter(logger *zap.Logger, cfg *Config) (*postgresqlTracesExporter, error) {
	if err := cfg.Validate(); err != nil {
		return nil, err
	}
	psqlconn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.DbName)

	db, err := sql.Open("postgres", psqlconn)

	if err != nil {
		fmt.Println("Error connecting to the database:", err)
		return nil, err
	}

	return &postgresqlTracesExporter{
		logger: logger,
		db:     db,
	}, nil

}

func (exporter *postgresqlTracesExporter) Shutdown(ctx context.Context) error {
	if err := exporter.db.Close(); err != nil {
		return fmt.Errorf("could not shut down postgresql exporter: %+v", err)
	}
	return nil
}

func (exporter *postgresqlTracesExporter) pushTracesData(ctx context.Context, traces ptrace.Traces) error {
	return fmt.Errorf("pushTracesData has not been implemented yet!")

}
