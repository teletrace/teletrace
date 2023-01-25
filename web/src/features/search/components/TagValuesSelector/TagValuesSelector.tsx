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
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDebounce } from "use-debounce";

import { CheckboxList } from "@/components/CheckboxList";
import { SearchField } from "@/components/SearchField";
import { formatNumber } from "@/utils/format";

import { useTagValuesWithAll } from "../../api/tagValues";
import { useSpanSearchStore } from "../../stores/spanSearchStore";
import { SearchFilter } from "../../types/common";
import { TagValue } from "../../types/tagValues";
import { styles } from "./styles";

export type TagValuesSelectorProps = {
  tag: string;
  title: string;
  searchable?: boolean;
  render?: (value: string | number) => React.ReactNode;
};

function extractFilterArrayValue(
  tag: string,
  filters: SearchFilter[]
): Array<string | number> {
  const filterIndex = filters.findIndex(
    (f) => f.keyValueFilter.key === tag && f.keyValueFilter.operator === "in"
  );
  const filterValue =
    filterIndex > -1 ? filters[filterIndex].keyValueFilter.value : [];
  return Array.isArray(filterValue) ? filterValue : [];
}

export const TagValuesSelector = ({
  title,
  tag,
  searchable,
}: TagValuesSelectorProps) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 170);

  const liveSpansState = useSpanSearchStore((state) => state.liveSpansState);
  const timeframeState = useSpanSearchStore((state) => state.timeframeState);
  const filtersState = useSpanSearchStore((state) => state.filtersState);

  const value = extractFilterArrayValue(tag, filtersState.filters);
  const filters = filtersState.filters.filter(
    (f) => !(f.keyValueFilter.key === tag && f.keyValueFilter.operator === "in")
  );

  const { data, isError, isFetching, isLoading } = useTagValuesWithAll(
    tag,
    debouncedSearch,
    {
      startTimeUnixNanoSec:
        timeframeState.currentTimeframe.startTimeUnixNanoSec,
      endTimeUnixNanoSec: timeframeState.currentTimeframe.endTimeUnixNanoSec,
    },
    filters,
    liveSpansState.isOn ? liveSpansState.intervalInMillis : 0
  );

  const tagOptions = data?.map((tag) => ({
    value: tag.value,
    label: <CheckboxListLabel key={tag.value} tag={tag} search={search} />,
  }));

  const handleCheckboxChange = (values: (string | number)[]) => {
    const filter: SearchFilter = {
      keyValueFilter: { key: tag, operator: "in", value: values },
    };

    const isEmptyCollectionFilter =
      ["in", "not_in"].includes(filter.keyValueFilter.operator) &&
      Array.isArray(filter.keyValueFilter.value) &&
      filter.keyValueFilter.value.length == 0;

    isEmptyCollectionFilter
      ? filtersState.deleteFilter(
          filter.keyValueFilter.key,
          filter.keyValueFilter.operator
        )
      : filtersState.createOrUpdateFilter(filter);
  };

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
              <Button onClick={() => filtersState.deleteFilter(tag, "in")}>
                Clear
              </Button>
            )}
          </AccordionActions>
        </Stack>

        <AccordionDetails sx={styles.accordionDetails}>
          {isError ? (
            <Alert severity="error">Failed loading tag values</Alert>
          ) : (
            <Fragment>
              {searchable && !isLoading && (
                <SearchField
                  value={search}
                  onChange={setSearch}
                  sx={styles.searchField}
                />
              )}

              <CheckboxList
                value={value}
                loading={isLoading}
                options={tagOptions || []}
                onChange={handleCheckboxChange}
                sx={styles.checkboxList}
              />

              {!tagOptions?.length && debouncedSearch === search && !isLoading && (
                <Typography
                  component="div"
                  variant="subtitle2"
                  color="GrayText"
                  sx={{ m: 1 }}
                >
                  No results found
                </Typography>
              )}
            </Fragment>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const CheckboxListLabel = ({
  tag,
  search,
}: {
  tag: TagValue;
  search: string;
}) => (
  <Tooltip arrow title={tag.value} placement="right">
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
    >
      <Typography noWrap sx={styles.valueLabel}>
        <Highlighter
          highlightClassName="valueLabelHighlight"
          searchWords={search.toLowerCase().split(" ")}
          autoEscape={true}
          textToHighlight={tag.value?.toString()}
        />
      </Typography>
      <Typography variant="button" color="GrayText">
        {formatNumber(tag.count)}
      </Typography>
    </Stack>
  </Tooltip>
);
