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

import { GraphNode } from "../TraceGraph/types";
import { SpanDetails } from "./SpanDetails/SpanDetails";
import { styles } from "./styles";

interface SpanDetailsListProps {
  selectedNode: GraphNode | null;
  selectedSpanId: string | null;
  setSelectedSpanId: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function sortSpansByStartTime(spans: InternalSpan[]) {
  return [...spans].sort((spanA, spanB) => {
    return spanA.span.startTimeUnixNano - spanB.span.startTimeUnixNano;
  });
}

export const SpanDetailsList = ({
  selectedNode,
  selectedSpanId,
  setSelectedSpanId,
  isLoading,
  setIsLoading,
}: SpanDetailsListProps) => {
  if (!selectedNode) {
    return <></>;
  }

  const spans = selectedNode ? selectedNode.spans : [];

  const sortedSpans = useMemo(
    () => spans && sortSpansByStartTime(spans),
    [spans]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, [sortedSpans, setIsLoading]);

  const handleChange = (spanId: string, expanded: boolean) => {
    const nextSelectedSpanId = expanded ? spanId : null;
    setSelectedSpanId(nextSelectedSpanId);
  };

  if (isLoading) {
    return (
      <Box sx={styles.container}>
        {sortedSpans &&
          sortedSpans.map((_, i) => {
            return (
              <Box key={i} sx={styles.skeletonWrapper}>
                <Skeleton variant="rounded" key={i} sx={styles.skeleton} />
              </Box>
            );
          })}
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
