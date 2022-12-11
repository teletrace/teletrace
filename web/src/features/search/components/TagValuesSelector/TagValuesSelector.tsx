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

import { CheckboxList } from "@/components/CheckboxList";
import { SearchField } from "@/components/SearchField";
import { formatNumber } from "@/utils/format";

import { useTagValues } from "../../api/tagValues";
import { SearchFilter, Timeframe } from "../../types/common";
import { TagValue, TagValuesRequest } from "../../types/tagValues";
import { styles } from "./styles";

export type TagValuesSelectorProps = {
  tag: string;
  title: string;
  value: Array<string | number>;
  searchable?: boolean;
  filters: Array<SearchFilter>;
  timeframe: Timeframe;
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
}: TagValuesSelectorProps) => {
  const [search, setSearch] = useState("");

  const tagValuesRequest: TagValuesRequest = {
    filters: filters,
    timeframe: timeframe,
  };

  const {
    data: tagValues,
    isFetching,
    isError,
  } = useTagValues(tag, tagValuesRequest);

  const clearTags = () => onChange?.([]);

  const tagOptions = tagValues?.pages
    .flatMap((page) => page.values)
    ?.filter((tag) => tag?.value.toString().includes(search))
    .map((tag) => ({
      value: tag.value,
      label: <CheckboxListLabel tag={tag} render={render} />,
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
              {searchable && !!tagValues && (
                <SearchField value={search} onChange={setSearch} />
              )}

              <CheckboxList
                value={value}
                loading={!tagValues}
                options={tagOptions || []}
                onChange={onChange}
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
