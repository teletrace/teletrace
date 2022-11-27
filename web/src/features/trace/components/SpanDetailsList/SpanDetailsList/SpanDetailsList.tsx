import { Box, Typography } from "@mui/material";

import { InternalSpan } from "@/types/span";

import { SpanDetails } from "../SpanDetails/SpanDetails";
import { styles } from "./styles";

interface SpanDetailsListProps {
  spans?: InternalSpan[];
  selectedSpanId?: string;
}

export const SpanDetailsList = ({
  spans,
  selectedSpanId,
}: SpanDetailsListProps) => {
  return (
    <Box sx={styles.container}>
      {spans ? (
        spans.map((span) => (
          <SpanDetails
            key={span.span.spanId}
            span={span}
            selectedSpanId={selectedSpanId}
          />
        ))
      ) : (
        <Typography>Select graph node to explore spans</Typography>
      )}
    </Box>
  );
};
