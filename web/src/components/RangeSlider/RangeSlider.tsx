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

import {Paper, Slider, Stack, TextField} from "@mui/material";
import React, {useState} from "react";

import {TagValue} from "@/features/search";
import {styles} from "@/components/RangeSlider/styles";

export type RangeSliderProps = {
    data?: TagValue[],
    render?: (value: string | number) => React.ReactNode;
}

export const RangeSlider = ({ data, render }: RangeSliderProps) => {
    const [sliderValue, setSliderValue] = useState<number[]>([0, 0]);

    let slider: JSX.Element = <p>No values were found</p>;
    if (data && data.length > 0) {
        const min = data[0].value as number;
        const max = data[data.length - 1].value as number;
        const finalMin = render ? render(min) as number : min;
        const finalMax = render ? render(max) as number : max;
        slider = <Slider
            valueLabelDisplay="auto"
            value={[sliderValue[0], sliderValue[1]]}
            min={finalMin}
            max={finalMax}
            onChange={(_: Event, newSliderValue: number | number[]) => {setSliderValue(newSliderValue as number[])}}
        />
    }

    return <Paper>
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
        <br/>
        {slider}
    </Paper>
}