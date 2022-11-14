import { MRT_ColumnDef as ColumnDef } from "material-react-table";

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
    accessorKey: "startTime",
    header: "Start Time",
    enableSorting: true,
  },
  {
    accessorKey: "duration",
    header: "Duration",
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Resource name",
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    Cell: (mrtCell) => {
      const code = mrtCell.cell.getValue();
      const isSuccessCode = code === 0;
      return (
        <StatusBadge
          color={isSuccessCode ? "success" : "error"}
          text={isSuccessCode ? "Ok" : "Error"}
        />
      );
    },
  },
  {
    accessorKey: "serviceName",
    header: "Service Name",
    enableSorting: false,
  },
];
