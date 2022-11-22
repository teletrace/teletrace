import { Box } from "@mui/material";

import { Span } from "../../spans-mock";
import { ServiceSpan } from "../ServiceSpan/ServiceSpan";
import { styles } from "./styles";

interface ServiceSpansListProps {
  spans: Span[];
}

export const ServiceSpansList = ({ spans }: ServiceSpansListProps) => {
  return (
    <Box sx={styles.container}>
      {spans.map((span) => (
        <ServiceSpan key={span.span.spanId} span={span} />
      ))}
    </Box>
  );
};
