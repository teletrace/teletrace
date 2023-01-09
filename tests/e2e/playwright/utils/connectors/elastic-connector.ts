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

import { Client } from "@elastic/elasticsearch";
import {
  CatIndicesResponse,
  ClusterPutSettingsResponse,
  IndicesResponseBase,
} from "@elastic/elasticsearch/lib/api/types";

import { Connector } from ".";

export class ElasticConnector extends Connector {
  private client: Client;

  constructor(nodeUrl: string = "http://localhost:9200") {
    super();
    this.client = new Client({ node: nodeUrl });
  }

  private getAllIndices = (): Promise<CatIndicesResponse> => {
    return this.client.cat.indices({ format: "json" });
  };

  private deleteAllIndices = (): Promise<IndicesResponseBase> => {
    return this.client.indices.delete({ index: "*" });
  };

  private updateClientSettings = (): Promise<ClusterPutSettingsResponse> => {
    return this.client.cluster.putSettings({
      persistent: {
        "action.destructive_requires_name": false,
      },
    });
  };

  async clean(): Promise<void> {
    try {
      await this.updateClientSettings();
      await this.deleteAllIndices();
    } catch (err) {
      throw new Error(`Connector failed to clean ElasticSearch: ${err}`);
    }
  }
}
