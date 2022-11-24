import { ArrowForward, ArrowForwardIosSharp } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { ReactComponent as DefaultResourceIcon } from "@/components/Elements/ResourceIcon/icons/DefaultResourceIcon.svg";
import { InternalSpan } from "@/types/span";

import { SpanAttributesGroup } from "../SpanAttributesGroup";
import { styles } from "./styles";
import { roundNanoToTwoDecimalMs } from "./utils";

export interface SpanDetailsProps {
  span: InternalSpan;
}

export const SpanDetails = ({ span }: SpanDetailsProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const X_DIVIDER = "|";

  return (
    <Accordion
      onChange={handleChange}
      disableGutters={true}
      sx={styles.accordion}
    >
      <AccordionSummary
        expandIcon={<ArrowForwardIosSharp sx={styles.expandArrowIcon} />}
        sx={{
          ...styles.accordionSummary,
          ...(expanded && styles.expandedAccordion),
        }}
      >
        <Stack sx={styles.spanFlowIconsContainer}>
          <DefaultResourceIcon style={styles.spanSourceIcon} />
          <ArrowForward style={styles.spanFlowArrowIcon} />
          <DefaultResourceIcon style={styles.spanDestIcon} />
        </Stack>
        <Stack>
          <Typography sx={styles.spanName}>{span.span.name}</Typography>
          <Typography sx={styles.spanTimes}>
            {`${roundNanoToTwoDecimalMs(span.externalFields.durationNano)}ms`}{" "}
            <Box component={"span"} sx={styles.spanTimesDivider}>
              {X_DIVIDER}
            </Box>{" "}
            {span.span.startTimeUnixNano}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionDetails}>
        <SpanAttributesGroup
          title="Basic"
          attributes={span.resource.attributes}
        />
        <SpanAttributesGroup
          title="Attributes"
          attributes={span.span.attributes}
        />
      </AccordionDetails>
    </Accordion>
  );
};
