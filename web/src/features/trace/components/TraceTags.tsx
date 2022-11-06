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

import { ReactComponent as IoTHTTP2Protocol } from "../styles/icons/IoTHTTP2Protocol.svg";
import { ReactComponent as LambdaFunction } from "../styles/icons/LambdaFunction.svg";
import styles from "../styles/styles.tags";
import { FlattenedSpan, SpansMock } from "./spansMock";

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
            <ExpandMoreIcon sx={ styles.accordionExpandIcon } />
          }
          sx={styles.accordionSummary}
          style={{
            backgroundColor: expanded === props.selectedSpanId ? grey[800] : "",
          }}
        >
          <Box
            sx={ styles.accordionIconsBox }
          >
            <IoTHTTP2Protocol
              style={{ width: "22px", height: "22px", marginLeft: "23px" }}
            />
            <ArrowForwardIcon
              style={{ fontSize: "medium", margin: "0 8px", color: "#96979E" }}
            />
            <LambdaFunction style={{ width: "25px" }} />
          </Box>
          <Box >
            <Typography sx={styles.accordionTitleTypography}>
              {props.span.spanAction}
            </Typography>
            <Typography sx={styles.accordionSummaryTypography}>
              {`${props.span.spanDuration}ms`}{" "}
              <span style={{ margin: "0 4px" }}>|</span>{" "}
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
    <Paper sx={{ width: "100%", backgroundColor: "black" }}>
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
