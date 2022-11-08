import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { ReactComponent as IoTHTTP2Protocol } from "@/styles/icons/IoTHTTP2Protocol.svg";
import { ReactComponent as LambdaFunction } from "@/styles/icons/LambdaFunction.svg";

import { FlattenedSpan } from "../spansMock";
import styles from "./styles";

interface Traces {
  spans: FlattenedSpan[];
  selectedSpanId: string;
}

interface TagsProps {
  span: FlattenedSpan;
  selectedSpanId: string;
}

export const TraceTags = ({ spans, selectedSpanId }: Traces) => {
  return (
    <Paper sx={styles.mainPaper}>
      {spans.map((span, index) => (
        <SingleTraceTags
          key={index}
          span={span}
          selectedSpanId={selectedSpanId}
        />
      ))}
    </Paper>
  );
};

export const SingleTraceTags = ({ span, selectedSpanId }: TagsProps) => {
  const [expanded, setExpanded] = useState(span.span.spanId === selectedSpanId);

  useEffect(() => {
    setExpanded(selectedSpanId === span.span.spanId);
  }, [selectedSpanId, span.span.spanId]);

  const X_DIVIDER = "|";

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={styles.mainAccordion}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={styles.accordionExpandIcon} />}
        sx={{
          ...(expanded ? styles.expandedRow : styles.notExpandedRow),
          ...styles.accordionSummary,
        }}
      >
        <Box sx={styles.accordionIconsBox}>
          <IoTHTTP2Protocol style={styles.accordionFirstNodeIcon} />
          <ArrowForwardIcon style={styles.accordionArrowIcon} />
          <LambdaFunction style={styles.accordionNodeIcon} />
        </Box>
        <Box>
          <Typography sx={styles.accordionTitleTypography}>
            {span.spanAction}
          </Typography>
          <Typography sx={styles.accordionSummaryTypography}>
            {`${span.spanDuration}ms`}{" "}
            <Box component={"span"} style={styles.accordionInnerTypography}>
              {X_DIVIDER}
            </Box>{" "}
            {span.spanDateTime}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Add inner accordion</Typography>
      </AccordionDetails>
    </Accordion>
  );
};
