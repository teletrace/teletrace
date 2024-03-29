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

import { ArrowForwardIosSharp, Link } from "@mui/icons-material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";

import { MiddleTruncatedTypography } from "@/components/Elements/MiddleTruncatedTypography";
import { ResourceIcon } from "@/components/Elements/ResourceIcon";
import { Attributes, InternalSpan, StatusCode } from "@/types/span";
import { formatDurationAsMs, formatNanoAsMsDateTime } from "@/utils/format";

import { getSpanResourceType } from "../../../utils/span-resource-type";
import { SpanAttributesGroup } from "../SpanAttributesGroup";
import { SpanErrorDetails } from "../SpanErrorDetails";
import { styles } from "./styles";

export interface SpanDetailsProps {
  span: InternalSpan;
  expanded: boolean;
  onChange: (expanded: boolean) => void;
}

function getBasicAttributes(span: InternalSpan): Attributes {
  const returnAttributes: Attributes = {
    service_name: span.resource.attributes["service.name"],
    name: span.span.name,
    status: span.span.status.code,
    kind: span.span.kind,
    duration: formatDurationAsMs(span.externalFields.durationNano),
    start_time: formatNanoAsMsDateTime(span.span.startTimeUnixNano),
    span_id: span.span.spanId,
    trace_id: span.span.traceId,
  };
  span.span.parentSpanId &&
    (returnAttributes["parent_span_id"] = span.span.parentSpanId);
  return returnAttributes;
}

function getErrorMessage(span: InternalSpan): string {
  let errorMessage = "";
  if (span.span.status.message) {
    errorMessage = span.span.status.message;
  } else if (span.span.attributes["grpc.error_message"]) {
    errorMessage = span.span.attributes["grpc.error_message"].toString();
  }
  return errorMessage;
}

export const SpanDetails = ({ span, expanded, onChange }: SpanDetailsProps) => {
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = useState(false);

  const accordionRef = useRef<HTMLDivElement>(null);
  const basicAttributes = useMemo(() => getBasicAttributes(span), [span]);
  const X_DIVIDER = "|";
  const hasError: boolean = span.span.status.code === StatusCode.Error;

  const handleURLCopy = (event: MouseEvent): void => {
    event.stopPropagation();
    const spanIdRegexExpr = /(spanId=)[^&|^?]+/;
    const location = window.location.href;
    navigator.clipboard
      .writeText(location.replace(spanIdRegexExpr, `$1${span.span.spanId}`))
      .then(() => setIsCopyTooltipVisible(true));
  };

  useEffect(() => {
    if (expanded && accordionRef.current) {
      accordionRef.current.scrollIntoView();
    }
  }, [expanded]);

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
        ref={accordionRef}
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
          <ResourceIcon
            name={getSpanResourceType(span)}
            style={styles.spanIcon}
          />
          <Stack sx={styles.spanSummaryContainer}>
            <MiddleTruncatedTypography
              sx={styles.spanName}
              text={span.span.name}
            />
            <Typography sx={styles.spanTimes}>
              {basicAttributes.duration}{" "}
              <Box component={"span"} sx={styles.spanTimesDivider}>
                {X_DIVIDER}
              </Box>{" "}
              {basicAttributes.start_time}
            </Typography>
          </Stack>

          <Tooltip
            title="Copied!"
            placement="top"
            open={isCopyTooltipVisible}
            onOpen={() =>
              setTimeout(() => setIsCopyTooltipVisible(false), 1500)
            }
          >
            <IconButton
              className="span-copy-button"
              sx={styles.spanURLCopyIcon}
              onClick={(event) => handleURLCopy(event as MouseEvent)}
            >
              <Link />
            </IconButton>
          </Tooltip>
        </AccordionSummary>
        <AccordionDetails sx={styles.accordionDetails}>
          {hasError && (
            <SpanErrorDetails errorMessage={getErrorMessage(span)} />
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
