import { Box, Typography } from "@mui/material";

import { InternalSpan } from "@/types/span";

import { SpanDetails } from "../SpanDetails/SpanDetails";
import { styles } from "./styles";

interface SpanDetailsListProps {
  spans?: InternalSpan[];
  selectedSpanId: string | null;
  setSelectedSpanId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SpanDetailsList = ({
  spans,
  selectedSpanId,
  setSelectedSpanId,
}: SpanDetailsListProps) => {
  const handleChange = (spanId: string, expanded: boolean) => {
    const nextSelectedSpanId = expanded ? spanId : null;
    setSelectedSpanId(nextSelectedSpanId);
  };

  return (
    <Box sx={styles.container}>
      {spans ? (
        spans.map((span) => (
          <SpanDetails
            key={span.span.spanId}
            span={span}
            expanded={selectedSpanId === span.span.spanId}
            onChange={(expanded: boolean) =>
              handleChange(span.span.spanId, expanded)
            }
          />
        ))
      ) : (
        <Typography>Select graph node to explore spans</Typography>
      )}
    </Box>
  );
};
