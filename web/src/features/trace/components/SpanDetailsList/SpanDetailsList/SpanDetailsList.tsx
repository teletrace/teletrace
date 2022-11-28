import { Box, Typography } from "@mui/material";

import { InternalSpan } from "@/types/span";

import { SpanDetails } from "../SpanDetails/SpanDetails";
import { styles } from "./styles";

interface SpanDetailsListProps {
  spans?: InternalSpan[];
  initallyFocusedSpanId?: string;
}

export const SpanDetailsList = ({
  spans,
  initallyFocusedSpanId,
}: SpanDetailsListProps) => {
  return (
    <Box sx={styles.container}>
      {spans ? (
        spans.map((span) => (
          <SpanDetails
            key={span.span.spanId}
            span={span}
            startExpanded={span.span.spanId === initallyFocusedSpanId}
          />
        ))
      ) : (
        <Typography>Select graph node to explore spans</Typography>
      )}
    </Box>
  );
};
