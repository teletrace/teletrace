/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ArrowForward, ArrowForwardIosSharp } from "@mui/icons-material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

import { ResourceIcon } from "@/components/Elements/ResourceIcon";
import { Attributes, InternalSpan, SpanKind, StatusCode } from "@/types/span";
import {
  formatNanoAsMsDateTime,
  roundNanoToTwoDecimalMs,
} from "@/utils/format";

import { SpanAttributesGroup } from "../SpanAttributesGroup";
import { SpanErrorDetails } from "../SpanErrorDetails";
import { styles } from "./styles";

export interface SpanDetailsProps {
  span: InternalSpan;
  expanded: boolean;
  onChange: (expanded: boolean) => void;
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

function getSpanIcon(span: Readonly<InternalSpan>): string {
  const attr = { ...span.resource.attributes, ...span.span.attributes };

  const typeNameSet = new Set<string>([
    "db.system",
    "db.type",
    "massaging.system",
  ]);

  for (const [key, value] of Object.entries(attr)) {
    if (typeNameSet.has(key)) {
      return value.toString();
    }
  }

  return "defaultresourceicon";
}

export const SpanDetails = ({ span, expanded, onChange }: SpanDetailsProps) => {
  const basicAttributes = useMemo(() => getBasicAttributes(span), [span]);
  const X_DIVIDER = "|";

  const hasError: boolean = span.span.status.code === StatusCode.Error;

  return (
    <Box
      sx={{
        ...styles.spanMainContainer,
        ...(hasError && styles.spanErrorMainContainer),
      }}
    >
      {hasError && (
        <Box sx={styles.spanErrorIconContainer}>
          <ErrorOutlineIcon style={styles.errorIcon} />
          {expanded && <Box sx={styles.expandedSpanErrorContainer} />}
        </Box>
      )}
      <Accordion
        expanded={expanded}
        onChange={(_, expanded) => onChange(expanded)}
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
              name={getSpanIcon(span)}
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
          {hasError && (
            <SpanErrorDetails errorMessage={span.span.status.message} />
          )}
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
    </Box>
  );
};
