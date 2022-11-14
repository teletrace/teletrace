import { ArrowForwardIosSharp } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Stack } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { ReactComponent as IoTHTTP2Protocol } from "@/styles/icons/IoTHTTP2Protocol.svg";
import { ReactComponent as LambdaFunction } from "@/styles/icons/LambdaFunction.svg";

import { Span } from "../../spans-mock";
import styles from "./styles";

interface ServiceSpanProps {
  span: Span;
}

export const ServiceSpan = ({ span }: ServiceSpanProps) => {
  // const [expanded, setExpanded] = useState(span.span.spanId === selectedSpanId);

  // useEffect(() => {
  //   setExpanded(selectedSpanId === span.span.spanId);
  // }, [selectedSpanId, span.span.spanId]);

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const X_DIVIDER = "|";

  return (
    <Accordion
      // expanded={expanded === span.span.spanId}
      onChange={handleChange(span.span.spanId)}
      disableGutters={true}
      sx={styles.mainAccordion}
    >
      <AccordionSummary
        expandIcon={
          <ArrowForwardIosSharp sx={styles.accordionExpandArrowIcon} />
        }
        sx={{
          ...styles.accordionSummary,
          ...(expanded && styles.expandedRow),
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
