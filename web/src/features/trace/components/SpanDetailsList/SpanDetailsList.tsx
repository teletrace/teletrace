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

import { Box, Skeleton } from "@mui/material";
import { useEffect, useMemo } from "react";

import { InternalSpan } from "@/types/span";

import { SpanDetails } from "./SpanDetails/SpanDetails";
import { styles } from "./styles";

interface SpanDetailsListProps {
  spans?: InternalSpan[];
  selectedSpanId: string | null;
  setSelectedSpanId: React.Dispatch<React.SetStateAction<string | null>>;

  spanDetailsIsLoading: boolean;
  setSpanDetailsIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function sortSpansByStartTime(spans: InternalSpan[]) {
  return [...spans].sort((spanA, spanB) => {
    return spanA.span.startTimeUnixNano - spanB.span.startTimeUnixNano;
  });
}

export const SpanDetailsList = ({
  spans,
  selectedSpanId,
  setSelectedSpanId,
  spanDetailsIsLoading,
  setSpanDetailsIsLoading,
}: SpanDetailsListProps) => {
  const sortedSpans = useMemo(
    () => spans && sortSpansByStartTime(spans),
    [spans]
  );

  useEffect(() => setSpanDetailsIsLoading(false), [sortedSpans]);

  const handleChange = (spanId: string, expanded: boolean) => {
    const nextSelectedSpanId = expanded ? spanId : null;
    setSelectedSpanId(nextSelectedSpanId);
  };
  if (spanDetailsIsLoading) {
    return (
      <Box sx={styles.container}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      {sortedSpans &&
        sortedSpans.map((span) => (
          <SpanDetails
            key={span.span.spanId}
            span={span}
            expanded={selectedSpanId === span.span.spanId}
            onChange={(expanded: boolean) =>
              handleChange(span.span.spanId, expanded)
            }
          />
        ))}
    </Box>
  );
};
