import { Box, Typography } from "@mui/material";

import { InternalSpan } from "@/types/span";

import { SpanDetails } from "../SpanDetails/SpanDetails";
import { styles } from "./styles";

interface SpanDetailsListProps {
  spans?: InternalSpan[];
}

export const SpanDetailsList = ({ spans }: SpanDetailsListProps) => {
  return (
    <Box sx={styles.container}>
      {spans ? (
        spans.map((span) => <SpanDetails key={span.span.spanId} span={span} />)
      ) : (
        <Typography>Select graph node to explore spans</Typography>
      )}
    </Box>
  );
};
