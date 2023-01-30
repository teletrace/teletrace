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

import {ArrowForwardIosSharp} from "@mui/icons-material";
import {
    Accordion, AccordionDetails,
    AccordionSummary, Alert,
    CircularProgress,
    Paper, Slider, Stack, TextField,
} from "@mui/material";
import {useEffect, useState} from "react";

import {msToNano, nanoToMs} from "@/utils/format";

import {useTagStatistics} from "../../api/tagStatistics";
import {isFiltersStructureEqual, useSpanSearchStore} from "../../stores/spanSearchStore";
import {TagStatistic} from "../../types/tagStatistics";
import {styles} from "./styles";

export type NumericTagSliderProps = {
    tag: string;
    title: string;
};
export const NumericTagSlider = ({title, tag}: NumericTagSliderProps) => {
    const [sliderValues, setSliderValues] = useState<number[]>([]);
    const [absoluteMin, setAbsoluteMin] = useState<number | undefined>(undefined);
    const [absoluteMax, setAbsoluteMax] = useState<number | undefined>(undefined);

    const timeframeState = useSpanSearchStore((state) => state.timeframeState);
    const filtersState = useSpanSearchStore((state) => state.filtersState);

    const { data, isFetching, isError } = useTagStatistics({
        tag: tag,
        filters: filtersState.filters,
        timeframe: timeframeState.currentTimeframe,
        desiredStatistics: [TagStatistic.Min, TagStatistic.Max]
    });

    const initializeSliderValues = () => {
        if (sliderValues.length === 0 && data) {
            if (Object.keys(data.statistics).length !== 0) {
                const min = data?.statistics[TagStatistic.Min];
                const max = data?.statistics[TagStatistic.Max];
                setSliderValues([min, max]);
                setAbsoluteMin(min);
                setAbsoluteMax(max);
            }
        }
    };
    useEffect(initializeSliderValues, [ data?.statistics ]);

    const discoverNewAbsoluteMinMax = () => {
        if (data) {
            const min = data?.statistics[TagStatistic.Min];
            const max = data?.statistics[TagStatistic.Max];
            if (absoluteMin && min < absoluteMin) {
                setAbsoluteMin(min);
            }

            if (absoluteMax && max > absoluteMax) {
                setAbsoluteMax(max);
            }
        }
    };
    useEffect(discoverNewAbsoluteMinMax, [ timeframeState.currentTimeframe ]);

    const gteFilterExists = () => filtersState.filters.find(filter =>
        isFiltersStructureEqual(
            filter.keyValueFilter.key,
            tag,
            filter.keyValueFilter.operator,
            "gte",
        )
    ) !== undefined;

    const lteFilterExists = () =>  filtersState.filters.find(filter =>
        isFiltersStructureEqual(
            filter.keyValueFilter.key,
            tag,
            filter.keyValueFilter.operator,
            "lte",
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
    useEffect(resetSliderValueOnFilterRemoved, [ filtersState.filters.length ]);

    const onSliderChange = () => {
        if (sliderValues.length > 0) {
            if (sliderValues[0] === absoluteMin) {
                gteFilterExists() && filtersState.deleteFilter(tag, "gte");
            } else {
                filtersState.createOrUpdateFilter({
                    keyValueFilter: {
                        key: tag,
                        operator: "gte",
                        value: sliderValues[0],
                    }
                });
            }

            if (sliderValues[1] === absoluteMax) {
                lteFilterExists() && filtersState.deleteFilter(tag, "lte");
            } else {
                filtersState.createOrUpdateFilter({
                    keyValueFilter: {
                        key: tag,
                        operator: "lte",
                        value: sliderValues[1],
                    }
                });
            }
        }
    };

    const displayTextBoxValue = (v: number) => sliderValues.length > 0 ? nanoToMs(v) : "-"

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
                    {
                    isError ?
                    <Alert severity="error">Failed loading {title} range slider</Alert>
                        :
                    <Paper>
                        <Stack display="flex" flexDirection="row" justifyContent="space-between">
                            <TextField
                                sx={styles.rangeInput}
                                value={displayTextBoxValue(sliderValues[0])}
                                disabled={sliderValues.length === 0 || isFetching}
                                onChange={(event) => {
                                    if (event.target.value) {
                                        const leftValueAsNano = msToNano(Number(event.target.value));
                                        setSliderValues([leftValueAsNano, sliderValues[1]]);
                                    }
                                }}
                            />
                            <TextField
                                sx={styles.rangeInput}
                                value={displayTextBoxValue(sliderValues[1])}
                                disabled={sliderValues.length === 0 || isFetching}
                                onChange={(event) => {
                                    if (event.target.value) {
                                        const rightValueAsNano = msToNano(Number(event.target.value));
                                        setSliderValues([sliderValues[0], rightValueAsNano]);
                                    }
                                }}
                            />
                        </Stack>
                        <br />
                        <Slider
                            valueLabelDisplay="auto"
                            value={[nanoToMs(sliderValues[0]), nanoToMs(sliderValues[1])]}
                            min={absoluteMin === undefined ? undefined : nanoToMs(absoluteMin)}
                            max={absoluteMax === undefined ? undefined : nanoToMs(absoluteMax)}
                            disabled={sliderValues.length === 0 || isFetching}
                            onChange={(_, newSliderValue: number | number[]) => {
                                const sliderValuesAsNano = (newSliderValue as number[]).map(v => msToNano(v));
                                setSliderValues(sliderValuesAsNano);
                            }}
                            onChangeCommitted={onSliderChange}
                        />
                    </Paper>
                    }
                </AccordionDetails>
            </Accordion>
        </div>
    )
}