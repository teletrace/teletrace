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

import { Paper, Stack } from "@mui/material";

import {useSpanSearchStore} from "@/stores/spanSearchStore";
import { StatusCode } from "@/types/span";

import { TagValuesSelector } from "../TagValuesSelector";
import { styles } from "./styles";

type TagOptions = {
  title: string;
  tag: string;
  isSearchable: boolean;
  render?: (value: string | number) => React.ReactNode;
};

export const TagSidebar = () => {
  const filters = useSpanSearchStore(state => state.filtersState.filters)

  const tags: Array<TagOptions> = [
    {
      title: "Status",
      tag: "span.status.code",
      isSearchable: false,
      render: (value) => StatusCode[parseInt(value.toString())],
    },
    {
      title: "Service Name",
      tag: "resource.attributes.service.name",
      isSearchable: true,
    },
    {
      title: "HTTP Route",
      tag: "span.attributes.http.route",
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
