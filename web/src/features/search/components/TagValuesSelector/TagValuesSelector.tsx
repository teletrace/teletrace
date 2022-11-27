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

const CheckboxListLabel = ({ tag, render }: { tag: TagValue, render?: (value: string | number) => React.ReactNode}) => (
  <Stack direction="row" alignItems="center" justifyContent="space-between">
    <Typography noWrap>{render ? render(tag.value) : tag.value}</Typography>
    <Typography variant="button" color="GrayText">
      {formatNumber(tag.count)}
    </Typography>
  </Stack>
);
