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

import { ArrowForwardIosSharp } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  CircularProgress,
  Paper,
  Slider,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { msToNano, nanoToMs } from "@/utils/format";
import { isNumeric } from "@/utils/numbers";

import { useTagStatistics } from "../../api/tagStatistics";
import {
  isFiltersStructureEqual,
  useSpanSearchStore,
} from "../../stores/spanSearchStore";
import {TagStatistic, TagStatisticsRequest, TagStatisticsResponse} from "../../types/tagStatistics";
import { isConvertedTimestamp } from "../../utils/tagsUtils";
import { styles } from "./styles";

export type NumericTagSliderProps = {
  tag: string;
  title: string;
};
export const NumericTagSlider = ({ title, tag }: NumericTagSliderProps) => {
  const [sliderValues, setSliderValues] = useState<number[]>([]);
  const [absoluteMin, setAbsoluteMin] = useState<number | undefined>(undefined);
  const [absoluteMax, setAbsoluteMax] = useState<number | undefined>(undefined);

  const timeframeState = useSpanSearchStore((state) => state.timeframeState);
  const filtersState = useSpanSearchStore((state) => state.filtersState);
  const liveSpansState = useSpanSearchStore((state) => state.liveSpansState);

  const initializeSliderValues = (res: TagStatisticsResponse) => {
    if (sliderValues.length === 0) {
      if (Object.keys(res.statistics).length !== 0) {
        const min = res.statistics[TagStatistic.MIN];
        const max = res.statistics[TagStatistic.MAX];
        setSliderValues([min, max]);
        setAbsoluteMin(min);
        setAbsoluteMax(max);
      }
    }
  }

  const updateMinMax = (min: number, max: number) => {
    if (absoluteMin && min < absoluteMin) {
      setAbsoluteMin(min);
    }

    if (absoluteMax && max > absoluteMax) {
      setAbsoluteMax(max);
    }
  }
  const updateSliderState = (res: TagStatisticsResponse) => {
    initializeSliderValues(res);
    updateMinMax(res.statistics[TagStatistic.MIN], res.statistics[TagStatistic.MAX])
  };

  const { isFetching, isError } = useTagStatistics(
    tag,
    {
      filters: filtersState.filters,
      timeframe: timeframeState.currentTimeframe,
      desiredStatistics: [TagStatistic.MIN, TagStatistic.MAX],
    },
    liveSpansState.intervalInMillis,
    updateSliderState,
  );

  const gteFilterExists = () =>
    filtersState.filters.find((filter) =>
      isFiltersStructureEqual(
        filter.keyValueFilter.key,
        tag,
        filter.keyValueFilter.operator,
        "gte"
      )
    ) !== undefined;

  const lteFilterExists = () =>
    filtersState.filters.find((filter) =>
      isFiltersStructureEqual(
        filter.keyValueFilter.key,
        tag,
        filter.keyValueFilter.operator,
        "lte"
      )
    ) !== undefined;

  const resetSliderValueOnFilterRemoved = () => {
    if (sliderValues.length > 0) {
      setSliderValues([
        gteFilterExists() ? sliderValues[0] : absoluteMin ?? 0,
        lteFilterExists() ? sliderValues[1] : absoluteMax ?? 0,
      ]);
    }
  };
  useEffect(resetSliderValueOnFilterRemoved, [filtersState.filters.length]);

  const deleteGteIfExists = () => {
    gteFilterExists() && filtersState.deleteFilter(tag, "gte");
  };

  const deleteLteIfExists = () => {
    lteFilterExists() && filtersState.deleteFilter(tag, "lte");
  };

  const handleFilters = () => {
    if (absoluteMin !== undefined && absoluteMax !== undefined) {
      if (sliderValues[0] < absoluteMin || sliderValues[0] > absoluteMax) {
        setSliderValues([absoluteMin, sliderValues[1]]);
        deleteGteIfExists();
        return;
      }

      if (sliderValues[1] > absoluteMax || sliderValues[1] < absoluteMin) {
        setSliderValues([sliderValues[0], absoluteMax]);
        deleteLteIfExists();
        return;
      }

      if (sliderValues.length > 0) {
        if (sliderValues[0] === absoluteMin) {
          deleteGteIfExists();
        } else {
          filtersState.createOrUpdateFilter({
            keyValueFilter: {
              key: tag,
              operator: "gte",
              value: sliderValues[0],
            },
          });
        }

        if (sliderValues[1] === absoluteMax) {
          deleteLteIfExists();
        } else {
          filtersState.createOrUpdateFilter({
            keyValueFilter: {
              key: tag,
              operator: "lte",
              value: sliderValues[1],
            },
          });
        }
      }
    }
  };

  const convertDisplayValue = (v: number, convertFn: (v: number) => number) =>
    isConvertedTimestamp(tag) ? convertFn(v) : v;
  const getTextBoxValue = (v: number) =>
    sliderValues.length > 0 ? convertDisplayValue(v, nanoToMs) : "-";

  const disableSlider =
    !liveSpansState.isOn && (sliderValues.length === 0 || isFetching);
  return (
    <div>
      <Accordion square disableGutters defaultExpanded sx={styles.accordion}>
        <Stack direction="row">
          <AccordionSummary
            sx={styles.accordionSummary}
            expandIcon={<ArrowForwardIosSharp sx={{ fontSize: "0.9rem" }} />}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <div>{title}</div>
              {isFetching && <CircularProgress size="1rem" />}
            </Stack>
          </AccordionSummary>
        </Stack>

        <AccordionDetails sx={styles.accordionDetails}>
          {isError ? (
            <Alert severity="error">Failed loading {title} range slider</Alert>
          ) : (
            <Paper>
              <Stack
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Tooltip
                  open={
                    absoluteMin !== undefined && sliderValues[0] < absoluteMin
                  }
                  title={
                    <>
                      <Typography>
                        You are below the min value{" "}
                        {absoluteMin &&
                          `(${convertDisplayValue(absoluteMin, nanoToMs)})`}
                      </Typography>
                    </>
                  }
                  placement="top-end"
                  arrow
                  PopperProps={{ sx: styles.tooltipPopper }}
                >
                  <TextField
                    sx={styles.rangeInput}
                    value={getTextBoxValue(sliderValues[0])}
                    disabled={disableSlider}
                    onChange={(event) => {
                      if (isNumeric(event.target.value)) {
                        setSliderValues([
                          convertDisplayValue(
                            Number(event.target.value),
                            msToNano
                          ),
                          sliderValues[1],
                        ]);
                      }
                    }}
                    onBlur={handleFilters}
                    onKeyDown={(event) =>
                      event.key === "Enter" && handleFilters()
                    }
                  />
                </Tooltip>
                <Tooltip
                  open={
                    absoluteMax !== undefined && sliderValues[1] > absoluteMax
                  }
                  title={
                    <>
                      <Typography>
                        You are above the max value{" "}
                        {absoluteMax &&
                          `(${convertDisplayValue(absoluteMax, nanoToMs)})`}
                      </Typography>
                    </>
                  }
                  placement="top-end"
                  arrow
                  PopperProps={{ sx: styles.tooltipPopper }}
                >
                  <TextField
                    sx={styles.rangeInput}
                    value={getTextBoxValue(sliderValues[1])}
                    disabled={disableSlider}
                    onChange={(event) => {
                      if (isNumeric(event.target.value)) {
                        setSliderValues([
                          sliderValues[0],
                          convertDisplayValue(
                            Number(event.target.value),
                            msToNano
                          ),
                        ]);
                      }
                    }}
                    onBlur={handleFilters}
                    onKeyDown={(event) =>
                      event.key === "Enter" && handleFilters()
                    }
                  />
                </Tooltip>
              </Stack>
              <br />
              <Slider
                valueLabelDisplay="auto"
                value={[
                  convertDisplayValue(sliderValues[0], nanoToMs),
                  convertDisplayValue(sliderValues[1], nanoToMs),
                ]}
                min={
                  absoluteMin === undefined
                    ? undefined
                    : convertDisplayValue(absoluteMin, nanoToMs)
                }
                max={
                  absoluteMax === undefined
                    ? undefined
                    : convertDisplayValue(absoluteMax, nanoToMs)
                }
                disabled={disableSlider}
                onChange={(_, newSliderValue: number | number[]) => {
                  const sliderValuesAsNano = (newSliderValue as number[]).map(
                    (v) => convertDisplayValue(v, msToNano)
                  );
                  setSliderValues(sliderValuesAsNano);
                }}
                onChangeCommitted={handleFilters}
                size="small"
              />
            </Paper>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
