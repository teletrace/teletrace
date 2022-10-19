import Box from '@mui/material/Box';
import { Stack } from '@mui/system';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { InternalSpan } from '../../../../model/InternalSpan';

type SpanTableProps = {
    spans: InternalSpan[];
};

export function SpanTable({ spans }: SpanTableProps) {
    const columns: GridColDef[] = [
        { field: 'startTime', headerName: 'Start time', width: 300, },
        { field: 'name', headerName: 'Name' },
        { field: 'statusCode', headerName: 'Status' },
        { field: 'serviceName', headerName: 'Service Name', width: 150, },
        { field: 'duration', headerName: 'Duration' }
    ];
    
    const rows = spans.map(({ resource, span }) => {
            return {
                id: span.traceId,
                traceId: span.traceId,
                spanId: span.spanId,
                startTime: (new Date(span.startTimeUnixNano).toString()),
                duration: (span.endTimeUnixNano - span.startTimeUnixNano),
                name: span.name,
                statusCode: span.status.code,
                serviceName: resource.attributes["service.name"]
            };
        }) ?? [];

    return (
        <Box sx={{ 
            height: 600, 
            width: '100%',
            "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "rgba(43, 45, 50, 1)",
            }
        }}>
            <DataGrid
                rows={rows}
                columns={columns}            
                loading={rows.length === 0}
                components={{
                    NoRowsOverlay: () => (
                      <Stack height="100%" alignItems="center" justifyContent="center">
                        No rows in DataGrid
                      </Stack>
                    )
                }}
            />
        </Box>
    )
}