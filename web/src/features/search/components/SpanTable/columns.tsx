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

import { MRT_ColumnDef as ColumnDef } from "material-react-table";

import { StatusCode } from "@/types/span";

import { StatusBadge } from "../StatusBadge";

const LOW_PRECISION_DURATION_DISPLAY = "<0.01";

export interface TableSpan {
  id: string;
  traceId: string;
  spanId: string;
  startTime: string;
  duration: number;
  name: string;
  status: number;
  serviceName: string;
}

export const columns: ColumnDef<TableSpan>[] = [
  {
    id: "span.startTimeUnixNano",
    accessorKey: "startTime",
    header: "Start Time",
    enableSorting: true,
  },
  {
    id: "externalFields.durationNano",
    accessorKey: "duration",
    header: "Duration",
    enableSorting: true,
    Cell: (mrtCell) => {
      const durationMillis = mrtCell.cell.getValue() as number;
      const durationString = durationMillis < 0.01 ? 
      LOW_PRECISION_DURATION_DISPLAY : durationMillis.toString()
      return `${durationString}ms`;
    },
  },
  {
    id: "span.name",
    accessorKey: "name",
    header: "Span name",
    enableSorting: false,
  },
  {
    id: "span.status.code",
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
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
    header: "Service Name",
    enableSorting: false,
  },
];
