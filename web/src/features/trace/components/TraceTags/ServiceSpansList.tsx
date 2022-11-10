import Paper from "@mui/material/Paper";

import { Span } from "../Spans";
import { ServiceSpan } from "./ServiceSpan";
import styles from "./styles";

interface ServiceSpans {
  spans: Span[];
  selectedSpanId: string;
}

export const ServiceSpansList = ({ spans, selectedSpanId }: ServiceSpans) => {
  return (
    <Paper sx={styles.mainPaper}>
      {spans.map((span, index) => (
        <ServiceSpan key={index} span={span} selectedSpanId={selectedSpanId} />
      ))}
    </Paper>
  );
};
