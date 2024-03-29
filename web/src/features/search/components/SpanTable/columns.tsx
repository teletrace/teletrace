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

import { MRT_ColumnDef as ColumnDef } from "material-react-table";

import { StatusCode } from "@/types/span";
import { formatDurationAsMs } from "@/utils/format";

import { StatusBadge } from "../StatusBadge";

export interface TableSpan {
  id: string;
  traceId: string;
  spanId: string;
  startTime: string;
  duration: number;
  name: string;
  status: string;
  serviceName: string;
  isNew: boolean;
}

export const sizeLimitedColumns = new Set([
  "span.startTimeUnixNano",
  "externalFields.durationNano",
  "span.status.code",
]);
export const columns: ColumnDef<TableSpan>[] = [
  {
    id: "span.startTimeUnixNano",
    accessorKey: "startTime",
    header: "Start time",
    enableSorting: true,
    minSize: 230,
    maxSize: 230,
    size: 230,
  },
  {
    id: "externalFields.durationNano",
    accessorKey: "duration",
    header: "Duration",
    enableSorting: true,
    minSize: 100,
    maxSize: 100,
    size: 100,
    Cell: (mrtCell) => {
      const durationMs = mrtCell.cell.getValue() as number;
      return formatDurationAsMs(durationMs);
    },
  },
  {
    id: "span.name",
    accessorKey: "name",
    header: "Span name",
    enableSorting: false,
    size: 460,
    minSize: 460,
    maxSize: 1000,
  },
  {
    id: "span.status.code",
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    minSize: 100,
    maxSize: 100,
    size: 100,
    Cell: (mrtCell) => {
      const code = mrtCell.cell.getValue();
      const isSuccessCode = code === StatusCode.Unset || code === StatusCode.OK;
      return (
        <StatusBadge
          color={isSuccessCode ? "success" : "error"}
          text={isSuccessCode ? "Ok" : "Error"}
        />
      );
    },
  },
  {
    id: "resource.attributes.service.name",
    accessorKey: "serviceName",
    header: "Service name",
    enableSorting: false,
    minSize: 150,
    maxSize: 300,
    size: 150,
  },
];
