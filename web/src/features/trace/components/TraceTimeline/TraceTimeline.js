/*
Copyright (c) 2017 Uber Technologies, Inc.
Modifications copyright (C) 2022 Cisco Systems, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { Search } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  ButtonGroup,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import { styles } from "./styles";
import TimelineViewer from "./TimelineViewer";
import { transformTraceData } from "./utils/trace";

export function TraceTimeline({ trace, selectedSpanId, setSelectedSpanId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [traceState, setTraceState] = useState({
    childrenHiddenIDs: new Set(),
    detailStates: new Map(),
    hoverIndentGuideIds: new Set(),
    jumpToSpan: null,
    spanNameColumnWidth: 0.25,
  });

  const transformedTrace = useMemo(() => transformTraceData(trace), [trace]);

  const setColumnWidth = (width) => {
    const newTraceState = { ...traceState, spanNameColumnWidth: width };
    setTraceState(newTraceState);
  };

  const removeHoverIndentGuideId = (spanID) => {
    const newHoverIndentGuideIds = new Set(traceState.hoverIndentGuideIds);
    newHoverIndentGuideIds.delete(spanID);

    const newTraceState = {
      ...traceState,
      hoverIndentGuideIds: newHoverIndentGuideIds,
    };
    setTraceState(newTraceState);
  };

  const setTrace = (trace) => {
    const { traceID } = trace;
    if (traceID === traceState.traceID) {
      return;
    }
    // preserve spanNameColumnWidth when resetting state
    const { spanNameColumnWidth } = traceState;
    const childrenHiddenIDs = new Set();
    const detailStates = new Map();
    const newTraceState = {
      ...traceState,
      childrenHiddenIDs,
      detailStates,
      spanNameColumnWidth,
      traceID,
    };
    setTraceState(newTraceState);
  };

  const removeJumpToSpan = () => {
    const newTraceState = { ...traceState, jumpToSpan: null };
    setTraceState(newTraceState);
  };

  const childrenToggle = (spanID) => {
    const childrenHiddenIDs = new Set(traceState.childrenHiddenIDs);
    if (childrenHiddenIDs.has(spanID)) {
      childrenHiddenIDs.delete(spanID);
    } else {
      childrenHiddenIDs.add(spanID);
    }
    const newTraceState = { ...traceState, childrenHiddenIDs };
    setTraceState(newTraceState);
  };

  const addHoverIndentGuideId = (spanID) => {
    const newHoverIndentGuideIds = new Set(traceState.hoverIndentGuideIds);
    newHoverIndentGuideIds.add(spanID);

    const newTraceState = {
      ...traceState,
      hoverIndentGuideIds: newHoverIndentGuideIds,
    };
    setTraceState(newTraceState);
  };

  return (
    <Box sx={styles.mainContainer}>
      <Box sx={styles.titleRow}>
        <Typography sx={styles.title} variant="h2">
          Spans
        </Typography>
        <TextField
          sx={styles.searchField}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={styles.searchIcon} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <Box sx={styles.searchFieldEndAdornment}>
                <Box sx={styles.resultCountWrapper}>
                  <span>0/{trace.length}</span>
                </Box>
                <ButtonGroup
                  sx={styles.searchToggleBtnGroup}
                  variant="outlined"
                  aria-label="outlined button group"
                >
                  <IconButton
                    sx={styles.searchToggleBtn}
                    aria-label="search previous"
                    size="medium"
                  >
                    <KeyboardArrowUpIcon />
                  </IconButton>
                  <IconButton
                    sx={styles.searchToggleBtn}
                    aria-label="search next"
                    size="medium"
                  >
                    <KeyboardArrowDownIcon />
                  </IconButton>
                </ButtonGroup>
              </Box>
            ),
          }}
        />
      </Box>
      <TimelineViewer
        trace={transformedTrace}
        selectedSpanId={selectedSpanId}
        setSelectedSpanId={setSelectedSpanId}
        setColumnWidth={setColumnWidth}
        removeHoverIndentGuideId={removeHoverIndentGuideId}
        setTrace={setTrace}
        removeJumpToSpan={removeJumpToSpan}
        childrenToggle={childrenToggle}
        traceState={traceState}
        addHoverIndentGuideId={addHoverIndentGuideId}
      />
    </Box>
  );
}
