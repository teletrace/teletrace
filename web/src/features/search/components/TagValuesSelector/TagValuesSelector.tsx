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
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  CircularProgress,
  Slider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {Fragment, useEffect, useMemo, useState} from "react";
import { useDebounce } from "use-debounce";

import { CheckboxList } from "@/components/CheckboxList";
import { SearchField } from "@/components/SearchField";
import {formatNumber, msToNanoSec} from "@/utils/format";

import { useTagValuesWithAll } from "../../api/tagValues";
import { SearchFilter, Timeframe } from "../../types/common";
import { TagValue } from "../../types/tagValues";
import { styles } from "./styles";

export type TagValuesSelectorProps = {
  tag: string;
  title: string;
  value: Array<string | number>;
  searchable?: boolean;
  filters: Array<SearchFilter>;
  timeframe: Timeframe;
  isSlider?: boolean;
  onChange?: (value: Array<string | number>) => void;
  render?: (value: string | number) => React.ReactNode;
};

export const TagValuesSelector = ({
  title,
  tag,
  value,
  filters,
  timeframe,
  searchable,
  onChange,
  render,
  isSlider,
}: TagValuesSelectorProps) => {
  const [search, setSearch] = useState("");
  const [sliderValue, setSliderValue] = useState<number[]>([0, 0]);
  const [debouncedSearch] = useDebounce(search, 500);
  const clearTags = () => onChange?.([]);

  const tagSearchFilter: SearchFilter = {
    keyValueFilter: { key: tag, operator: "contains", value: debouncedSearch },
  };

  const tagFilters: Array<SearchFilter> = useMemo(
    () =>
      tagSearchFilter.keyValueFilter.value
        ? [...filters, tagSearchFilter]
        : filters,
    [filters, tagSearchFilter]
  );

  const { data, isError, isFetching } = useTagValuesWithAll(
    tag,
    timeframe,
    tagFilters
  );

  let slider: JSX.Element = <p>Failed to display slider</p>;
  if (data && data.length > 0 && isSlider) {
    const min = data[0].value as number;
    const max = data[data.length - 1].value as number;
    const finalMin = render ? render(min) as number : min;
    const finalMax = render ? render(max) as number : max;
    slider = <Slider
        getAriaLabel={() => "Custom marks"}
        valueLabelDisplay="auto"
        value={[sliderValue[0], sliderValue[1]]}
        min={finalMin}
        max={finalMax}
        onChange={(_: Event, newSliderValue: number | number[]) => {setSliderValue(newSliderValue as number[])}}
    />
  }

  const tagOptions = data
    ?.filter((tag) => tag?.value.toString().includes(search))
    .map((tag) => ({
      value: tag.value,
      label: <CheckboxListLabel key={tag.value} tag={tag} render={render} />,
    }));


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
          <AccordionActions>
            {value.length > 0 && (
              <Button size="small" onClick={clearTags}>
                Clear
              </Button>
            )}
          </AccordionActions>
        </Stack>

        <AccordionDetails>
          {isError ? (
            <Alert severity="error">Failed loading tag values</Alert>
          ) : (
            <Fragment>
              {searchable && !!data && (
                <SearchField value={search} onChange={setSearch} />
              )}

              {
                isSlider ?
                  slider
                  :
                  <CheckboxList
                    value={value}
                    loading={false}
                    options={tagOptions || []}
                    onChange={onChange}
                  />
              }
            </Fragment>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const CheckboxListLabel = ({
  tag,
  render,
}: {
  tag: TagValue;
  render?: (value: string | number) => React.ReactNode;
}) => (
  <Tooltip arrow title={tag.value} placement="right">
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
    >
      <Typography noWrap sx={styles.valueLabel}>
        <span>{render ? render(tag.value) : tag.value}</span>
      </Typography>
      <Typography variant="button" color="GrayText">
        {formatNumber(tag.count)}
      </Typography>
    </Stack>
  </Tooltip>
);
