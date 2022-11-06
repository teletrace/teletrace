import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { ReactComponent as IoTHTTP2Protocol } from "@/styles/icons/IoTHTTP2Protocol.svg";
import { ReactComponent as LambdaFunction } from "@/styles/icons/LambdaFunction.svg";

import { FlattenedSpan } from "../spansMock";
import styles from "./styles";

interface TraceTagsProps {
  spans: FlattenedSpan[];
}
interface TagsProps {
  span: FlattenedSpan;
  selectedSpanId: string;
}

export const TraceTags = ({ spans }: TraceTagsProps) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  function TagsMainAccordion(props: TagsProps) {
    return (
      <Accordion
        expanded={expanded === props.selectedSpanId}
        onChange={handleChange(props.selectedSpanId)}
        sx={styles.mainAccordion}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={styles.accordionExpandIcon}
              style={
                expanded === props.selectedSpanId
                  ? styles.expandedRowIcon
                  : styles.notExpandedRowIcon
              }
            />
          }
          sx={styles.accordionSummary}
          style={
            expanded === props.selectedSpanId
              ? styles.expandedRow
              : styles.notExpandedRow
          }
        >
          <Box sx={styles.accordionIconsBox}>
            <IoTHTTP2Protocol style={styles.accordionNodeIcon} />
            <ArrowForwardIcon style={styles.accordionArrowIcon} />
            <LambdaFunction style={styles.accordionNodeIcon} />
          </Box>
          <Box>
            <Typography sx={styles.accordionTitleTypography}>
              {props.span.spanAction}
            </Typography>
            <Typography sx={styles.accordionSummaryTypography}>
              {`${props.span.spanDuration}ms`}{" "}
              <span style={styles.accordionInnerTypography}>|</span>{" "}
              {props.span.spanDateTime}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Add inner accordion</Typography>
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Paper sx={styles.mainPaper}>
      {spans.map((span, index) => (
        <TagsMainAccordion
          key={index}
          span={span}
          selectedSpanId={index.toString()}
        />
      ))}
    </Paper>
  );
};
