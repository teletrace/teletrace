import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Stack } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { ReactComponent as IoTHTTP2Protocol } from "@/styles/icons/IoTHTTP2Protocol.svg";
import { ReactComponent as LambdaFunction } from "@/styles/icons/LambdaFunction.svg";

import { Span } from "../Spans";
import styles from "./styles";

interface SpanTagsProps {
  span: Span;
  selectedSpanId: string;
}

export const ServiceSpan = ({ span, selectedSpanId }: SpanTagsProps) => {
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
        <Stack sx={styles.accordionIconsBox}>
          <IoTHTTP2Protocol style={styles.accordionFirstNodeIcon} />
          <ArrowForwardIcon style={styles.accordionArrowIcon} />
          <LambdaFunction style={styles.accordionNodeIcon} />
        </Stack>
        <Stack>
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
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Add inner accordion</Typography>
      </AccordionDetails>
    </Accordion>
  );
};
