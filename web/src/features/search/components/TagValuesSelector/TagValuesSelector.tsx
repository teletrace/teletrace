import { ArrowForwardIosSharp } from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { useTagValues } from "../../api/tagValues";
import { TagValue } from "../../types/tagValues";
import { styles } from "./styles";

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
  const [search, setSearch] = useState("");
  const { data: tagValues, isLoading } = useTagValues(tag);

  const clearTags = () => onChange?.([]);

  const tagOptions = tagValues
    ?.filter((tag) => tag.value.toString().includes(search))
    .map((tag) => ({
      value: tag.value,
      label: <CheckboxListLabel tag={tag} />,
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
              {isLoading && <CircularProgress size="1rem" />}
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
          {searchable && !!tagValues && (
            <SearchField value={search} onChange={setSearch} />
          )}

          <CheckboxList
            value={value}
            loading={!tagValues}
            options={tagOptions || []}
            onChange={onChange}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const CheckboxListLabel = ({ tag }: { tag: TagValue }) => (
  <Stack direction="row" alignItems="center" justifyContent="space-between">
    <Typography noWrap>{tag.value}</Typography>
    <Typography variant="button" color="GrayText">
      {formatNumber(tag.occurrences)}
    </Typography>
  </Stack>
);
