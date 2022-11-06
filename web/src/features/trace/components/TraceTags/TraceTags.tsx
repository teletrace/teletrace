import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { grey } from "@mui/material/colors";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { ReactComponent as IoTHTTP2Protocol } from "@/styles/icons/IoTHTTP2Protocol.svg";
import { ReactComponent as LambdaFunction } from "@/styles/icons/LambdaFunction.svg";

import { FlattenedSpan, SpansMock } from "../spansMock";
import styles from "./styles";

interface TagsProps {
  span: FlattenedSpan;
  selectedSpanId: string;
}

export const TraceTags = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
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
              style={{
                marginLeft: expanded === props.selectedSpanId ? "23px" : "0",
                marginRight: expanded === props.selectedSpanId ? "0" : "23px",
              }}
            />
          }
          sx={styles.accordionSummary}
          style={{
            backgroundColor: expanded === props.selectedSpanId ? grey[800] : "",
          }}
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
      {Array.from(SpansMock).map((spanMock, index) => (
        <TagsMainAccordion
          key={index}
          span={spanMock}
          selectedSpanId={index.toString()}
        />
      ))}
    </Paper>
  );
};
