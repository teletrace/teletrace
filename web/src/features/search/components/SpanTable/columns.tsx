import { MRT_ColumnDef as ColumnDef } from "material-react-table";

import { StatusCode } from "@/types/span";

import { StatusBadge } from "../StatusBadge";

export interface TableSpan {
  id: string;
  traceId: string;
  spanId: string;
  startTime: string;
  duration: string;
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
      const isSuccessCode = code === StatusCode.UNSET || code === StatusCode.OK;
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
