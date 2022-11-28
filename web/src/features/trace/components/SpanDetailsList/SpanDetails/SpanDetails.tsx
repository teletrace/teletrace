import { ArrowForward, ArrowForwardIosSharp } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import { ResourceIcon } from "@/components/Elements/ResourceIcon";
import { Attributes, InternalSpan, SpanKind, StatusCode } from "@/types/span";
import {
  formatNanoAsMsDateTime,
  roundNanoToTwoDecimalMs,
} from "@/utils/format";

import { SpanAttributesGroup } from "../SpanAttributesGroup";
import { styles } from "./styles";

export interface SpanDetailsProps {
  span: InternalSpan;
  startExpanded?: boolean;
}

function getBasicAttributes(span: InternalSpan): Attributes {
  return {
    service_name: span.resource.attributes["service.name"],
    name: span.span.name,
    status: StatusCode[span.span.status.code],
    kind: SpanKind[span.span.kind],
    duration: `${roundNanoToTwoDecimalMs(span.externalFields.durationNano)}ms`,
    start_time: formatNanoAsMsDateTime(span.span.startTimeUnixNano),
    span_id: span.span.spanId,
    trace_id: span.span.traceId,
  };
}

export const SpanDetails = ({ span, startExpanded }: SpanDetailsProps) => {
  const [expanded, setExpanded] = useState(startExpanded);
  const basicAttributes = useMemo(() => getBasicAttributes(span), [span]);

  const handleChange = (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const X_DIVIDER = "|";

  return (
    <Accordion
      expanded={expanded}
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
          <ResourceIcon
            name="defaultresourceicon"
            style={styles.spanSourceIcon}
          />
          <ArrowForward style={styles.spanFlowArrowIcon} />
          <ResourceIcon
            name="defaultresourceicon"
            style={styles.spanDestIcon}
          />
        </Stack>
        <Stack>
          <Typography sx={styles.spanName}>{span.span.name}</Typography>
          <Typography sx={styles.spanTimes}>
            {basicAttributes.duration}{" "}
            <Box component={"span"} sx={styles.spanTimesDivider}>
              {X_DIVIDER}
            </Box>{" "}
            {basicAttributes.start_time}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionDetails}>
        <SpanAttributesGroup
          title="Basic"
          attributes={basicAttributes}
          startExpanded
        />
        {Object.keys(span.span.attributes).length > 0 && (
          <SpanAttributesGroup
            title="Attributes"
            attributes={span.span.attributes}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};
