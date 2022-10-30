import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";

import { useTagValues } from "../../api/tagValues";
import { TagValue } from "../../types/tagValues";

import { CheckboxList } from "@/components/CheckboxList";
import { SearchField } from "@/components/SearchField";
import { formatNumber } from "@/utils/format";

export type TagValuesSelectorProps = {
  tag: string;
  title: string;
  value: Array<string | number>;
  searchable?: boolean;
  onChange?: (value: Array<string | number>) => void;
};

export const TagValuesSelector = ({
  title,
  tag,
  value,
  searchable,
  onChange,
}: TagValuesSelectorProps) => {
  const { data: tagValues, isLoading } = useTagValues(tag);
  const [search, setSearch] = useState("");

  const tagOptions =
    tagValues?.filter((tag) => tag.value.toString().includes(search)) || [];

  return (
    <div style={{ width: 300 }}>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ flexDirection: "row-reverse" }}
        >
          <Stack direction="row" spacing={2}>
            <div>{title}</div>
            <div>{isLoading && <CircularProgress size="1rem" />}</div>
          </Stack>
        </AccordionSummary>

        <AccordionDetails>
          {!tagValues ? (
            <LoaderSkeleton />
          ) : (
            <Fragment>
              {searchable && (
                <SearchField value={search} onChange={setSearch} />
              )}

              <CheckboxList
                value={value}
                onChange={onChange}
                options={tagOptions.map((tag) => ({
                  value: tag.value,
                  label: <CheckboxListLabel tag={tag} />,
                }))}
              />
            </Fragment>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const LoaderSkeleton = () => (
  <Fragment>
    <Skeleton
      height={40}
      variant="rounded"
      sx={(theme) => ({ marginBottom: theme.spacing(1) })}
    />
    <Skeleton sx={{ fontSize: "2rem" }} width="60%" />
    <Skeleton sx={{ fontSize: "2rem" }} width="60%" />
    <Skeleton sx={{ fontSize: "2rem" }} width="60%" />
    <Skeleton sx={{ fontSize: "2rem" }} width="60%" />
  </Fragment>
);

const CheckboxListLabel = ({ tag }: { tag: TagValue }) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
    justifyContent="space-between"
  >
    <Typography>{tag.value}</Typography>
    <Typography variant="button" color="GrayText">
      {formatNumber(tag.occurrences)}
    </Typography>
  </Stack>
);
