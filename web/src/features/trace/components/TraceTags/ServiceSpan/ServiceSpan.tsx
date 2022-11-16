import { ArrowForwardIosSharp } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Stack } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { ReactComponent as IoTHTTP2Protocol } from "@/components/Elements/ResourceIcon/icons/IoTHTTP2Protocol.svg";
import { ReactComponent as Lambda } from "@/components/Elements/ResourceIcon/icons/Lambda.svg";

import { Span } from "../../spans-mock";
import ServiceSpanTags from "../ServiceSpanTags";
import styles from "./styles";

export interface ServiceSpanProps {
  span: Span;
}

export const ServiceSpan = ({ span }: ServiceSpanProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const X_DIVIDER = "|";

  return (
    <Accordion
      onChange={handleChange}
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
          <Lambda style={styles.accordionNodeIcon} />
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
      <ServiceSpanTags span={span} />
    </Accordion>
  );
};
