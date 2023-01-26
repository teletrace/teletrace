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

import {useTagStatistics} from "../../api/tagStatistics";
import {useSpanSearchStore} from "../../stores/spanSearchStore";
import {TagStatistic} from "../../types/tagStatistics";
import {styles} from "./styles";

export type NumericTagSliderProps = {
    tag: string;
    title: string;
};
export const NumericTagSlider = ({title, tag}: NumericTagSliderProps) => {
    const [sliderValue, setSliderValue] = useState<number[]>([0, 0]);

    const timeframeState = useSpanSearchStore((state) => state.timeframeState);
    const filtersState = useSpanSearchStore((state) => state.filtersState);

    const { data, isFetching, isError } = useTagStatistics({
        tag: tag,
        filters: filtersState.filters,
        timeframe: timeframeState.currentTimeframe,
        desiredStatistics: [TagStatistic.Min, TagStatistic.Max]
    });

    useEffect(() => {
        if (data) {
            setSliderValue([data?.statistics[TagStatistic.Min], data?.statistics[TagStatistic.Max]])
        }
    }, [ data?.statistics[TagStatistic.Min], data?.statistics[TagStatistic.Max] ]);

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
                    <Alert severity="error">Failed loading tag range slider</Alert>
                        :
                    <Paper>
                        <Stack display="flex" flexDirection="row" justifyContent="space-between">
                            <TextField
                                sx={styles.rangeInput}
                                value={sliderValue[0]}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = Number(event.target.value);
                                    setSliderValue([value, sliderValue[1]]);
                                }}
                            />
                            <TextField
                                sx={styles.rangeInput}
                                value={sliderValue[1]}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = Number(event.target.value);
                                    setSliderValue([sliderValue[0], value]);
                                }}
                            />
                        </Stack>
                        <br />
                        <Slider
                            valueLabelDisplay="auto"
                            value={[sliderValue[0], sliderValue[1]]}
                            min={data?.statistics[TagStatistic.Min]}
                            max={data?.statistics[TagStatistic.Max]}
                            onChange={(_: Event, newSliderValue: number | number[]) => {
                                setSliderValue(newSliderValue as number[]);
                            }}
                        />
                    </Paper>
                    }
                </AccordionDetails>
            </Accordion>
        </div>
    )
}