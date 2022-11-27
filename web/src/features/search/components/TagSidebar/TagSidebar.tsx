import { Paper, Stack } from "@mui/material";

import { StatusCode } from "../../../../types/span";
import { SearchFilter, Timeframe } from "../../types/common";
import { TagValuesSelector } from "../TagValuesSelector";
import { styles } from "./styles";

export type TagSidebarProps = {
  filters: Array<SearchFilter>;
  timeframe: Timeframe;
  onChange: (entry: SearchFilter) => void;
};

type TagOptions = {
  title: string;
  tag: string;
  isSearchable: boolean;
  render?: (value: string | number) => React.ReactNode;
};

export const TagSidebar = ({
  filters,
  timeframe,
  onChange,
}: TagSidebarProps) => {
  const onFilterChange = (
    key: string,
    label: string,
    values: Array<string | number>
  ) => {
    onChange({ keyValueFilter: { key: key, operator: "in", value: values } });
  };
  const tags: Array<TagOptions> = [
    { 
      title: "Status",
      tag: "span.status.code",
      isSearchable: false,
      render: value =>
        value === StatusCode.UNSET || value === StatusCode.OK ? 'Ok' : 'Error',
    },
    {
      title: "Service Name",
      tag: "resource.attributes.service.name",
      isSearchable: true,
    },
    {
      title: "HTTP Route",
      tag: "span.attributes.http.target",
      isSearchable: true,
    },
    {
      title: "HTTP Method",
      tag: "span.attributes.http.method",
      isSearchable: true,
    },
    {
      title: "HTTP Status Code",
      tag: "span.attributes.http.status_code",
      isSearchable: true,
    },
    { title: "Instrumentation Library", tag: "scope.name", isSearchable: true },
  ];

  return (
    <Paper sx={{ overflowY: "auto", overflowX: "hidden" }}>
      <Stack spacing="2px" sx={styles.sideTagBar}>
        {tags.map((t) => {
          const filterIndex = filters.findIndex(
            (f) =>
              f.keyValueFilter.key === t.tag &&
              f.keyValueFilter.operator === "in"
          );
          const value =
            filterIndex > -1 ? filters[filterIndex].keyValueFilter.value : [];
          return (
            <TagValuesSelector
              key={t.tag}
              title={t.title}
              tag={t.tag}
              value={Array.isArray(value) ? value : []}
              filters={filters.filter(
                (f) =>
                  !(
                    f.keyValueFilter.key === t.tag &&
                    f.keyValueFilter.operator === "in"
                  )
              )} // remove the current tag
              timeframe={timeframe}
              onChange={(values) => onFilterChange(t.tag, t.title, values)}
              searchable={t.isSearchable}
              render={t.render}
            />
          );
        })}
      </Stack>
    </Paper>
  );
};
