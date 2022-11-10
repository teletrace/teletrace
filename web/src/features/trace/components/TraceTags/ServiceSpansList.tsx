import Paper from "@mui/material/Paper";

import { FlattenedSpan } from "../Spans";
import { SingleServiceSpan } from "./SingleServiceSpan";
import styles from "./styles";

interface ServiceSpans {
  spans: FlattenedSpan[];
  selectedSpanId: string;
}

export const ServiceSpansList = ({ spans, selectedSpanId }: ServiceSpans) => {
  return (
    <Paper sx={styles.mainPaper}>
      {spans.map((span, index) => (
        <SingleServiceSpan
          key={index}
          span={span}
          selectedSpanId={selectedSpanId}
        />
      ))}
    </Paper>
  );
};
