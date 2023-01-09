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
import { Fragment, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import { CheckboxList } from "@/components/CheckboxList";
import { SearchField } from "@/components/SearchField";
import { useSpanSearchStore } from "@/stores/spanSearchStore";
import { formatNumber } from "@/utils/format";

import { getPredefinedFilterId } from "../../../search/utils/filters_utils";
import { useTagValuesWithAll } from "../../api/tagValues";
import { DisplaySearchFilter, SearchFilter } from "../../types/common";
import { TagValue } from "../../types/tagValues";
import { styles } from "./styles";

export type TagValuesSelectorProps = {
  tag: string;
  title: string;
  searchable?: boolean;
  render?: (value: string | number) => React.ReactNode;
};

function getValue(filterIndex: number, filters: SearchFilter[]) {
  const intermediateValue =
    filterIndex > -1 ? filters[filterIndex].keyValueFilter.value : [];
  return Array.isArray(intermediateValue) ? intermediateValue : [];
}

export const TagValuesSelector = ({
  title,
  tag,
  searchable,
  render,
}: TagValuesSelectorProps) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const { liveSpansState, timeframeState, filtersState } = useSpanSearchStore(
    (state) => state
  );

  const value = getValue(
    filtersState.filters.findIndex(
      (f) => f.keyValueFilter.key === tag && f.keyValueFilter.operator === "in"
    ),
    filtersState.filters
  );
  const filters = filtersState.filters.filter(
    (f) => !(f.keyValueFilter.key === tag && f.keyValueFilter.operator === "in")
  );

  const tagSearchFilter: SearchFilter = {
    keyValueFilter: { key: tag, operator: "contains", value: debouncedSearch },
  };

  const tagFilters: Array<SearchFilter> = useMemo(
    () =>
      tagSearchFilter.keyValueFilter.value
        ? [...filters, tagSearchFilter]
        : filters,
    [filters, tagSearchFilter.keyValueFilter]
  );

  const { data, isError, isFetching } = useTagValuesWithAll(
    tag,
    {
      startTimeUnixNanoSec:
        timeframeState.currentTimeframe.startTimeUnixNanoSec,
      endTimeUnixNanoSec: timeframeState.currentTimeframe.endTimeUnixNanoSec,
    },
    tagFilters,
    liveSpansState.isOn ? liveSpansState.intervalInMillis : 0
  );
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
              <Button
                size="small"
                onClick={() =>
                  filtersState.deleteFilter(getPredefinedFilterId(tag, "in"))
                }
              >
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
              {searchable && !!data && (
                <SearchField value={search} onChange={setSearch} />
              )}

              <CheckboxList
                value={value}
                loading={false}
                options={tagOptions || []}
                onChange={(values) => {
                  const filter: DisplaySearchFilter = {
                    id: getPredefinedFilterId(tag, "in"),
                    keyValueFilter: { key: tag, operator: "in", value: values },
                  };

                  const isEmptyCollectionFilter =
                    ["in", "not_in"].includes(filter.keyValueFilter.operator) &&
                    Array.isArray(filter.keyValueFilter.value) &&
                    filter.keyValueFilter.value.length == 0;

                  if (isEmptyCollectionFilter) {
                    filtersState.deleteFilter(filter.id);
                  } else {
                    filtersState.saveFilter(filter);
                  }
                }}
                sx={styles.checkboxList}
              />
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
