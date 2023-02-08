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

const util = require('util');
import { exec } from "child_process";
import { Connector } from ".";

const dockerExecCommandPrefix = "docker exec ";
const sqliteQueryCommandPrefix = "sqlite3 embedded_spans.db ";
const deleteTableRecordsPrefix = "DELETE FROM "
const asyncExec = util.promisify(exec);

export class SQLiteConnector extends Connector {

  private containerName: string;

  constructor(containerName: string = "docker-compose-lupa-api-1") {
    super();
    this.containerName = containerName;
  }

  private deleteAllRecords = (): Promise<{}> => {
    const tables:string[] = [
      "spans",
      "scopes",
      "events",
      "links",
      "span_attributes",
      "scope_attributes",
      "resource_attributes",
      "event_attributes",
      "link_attributes",
      "span_resource_attributes",
    ];
    var cleanPromises:Promise<{}>[] = [];
    tables.forEach( (table) => {
      const deleteQuery = "'" + deleteTableRecordsPrefix + table + "'";
      cleanPromises.push(
        asyncExec(
          dockerExecCommandPrefix + 
          this.containerName + 
          " " + 
          sqliteQueryCommandPrefix + 
          deleteQuery
      ))
    });
    return Promise.all(cleanPromises);
  };

  private installSqliteCLI = (): Promise<{}> => {
    return asyncExec(dockerExecCommandPrefix + this.containerName + " apk add --no-cache sqlite")
  };

  async clean(): Promise<void> {
    try {
      await this.installSqliteCLI();
      await this.deleteAllRecords();
    } catch (err) {
      throw new Error(`Connector failed to clean SQLite Spans DB: ${err}`);
    }
  }
}
