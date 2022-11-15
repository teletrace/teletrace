import Paper from "@mui/material/Paper";

import { Span } from "../../spans-mock";
import { ServiceSpan } from "../ServiceSpan/ServiceSpan";
import { styles } from "./styles";

interface ServiceSpansListProps {
  spans: Span[];
}

export const ServiceSpansList = ({ spans }: ServiceSpansListProps) => {
  return (
    <Paper sx={styles.mainPaper}>
      {spans.map((span) => (
        <ServiceSpan key={span.span.spanId} span={span} />
      ))}
    </Paper>
  );
};
