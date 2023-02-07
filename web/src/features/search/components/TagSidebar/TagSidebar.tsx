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

import { NumericTagSlider } from "../NumericTagSlider";
import { TagValuesSelector } from "../TagValuesSelector";
import { styles } from "./styles";

type TagOptions = {
  title: string;
  tag: string;
  selectorType: SelectorType;
  isSearchable?: boolean;
};

export enum SelectorType {
  ValuesSelector,
  RangeSlider,
}

export const TagSidebar = () => {
  let tags: Array<TagOptions> = [
    {
      title: "Status",
      tag: "span.status.code",
      isSearchable: false,
      selectorType: SelectorType.ValuesSelector,
    },
    {
      title: "Duration (ms)",
      tag: "externalFields.durationNano",
      isSearchable: false,
      selectorType: SelectorType.RangeSlider,
    },
    {
      title: "Service name",
      tag: "resource.attributes.service.name",
      isSearchable: true,
      selectorType: SelectorType.ValuesSelector,
    },
    {
      title: "HTTP route",
      tag: "span.attributes.http.route",
      isSearchable: true,
      selectorType: SelectorType.ValuesSelector,
    },
    {
      title: "HTTP method",
      tag: "span.attributes.http.method",
      isSearchable: true,
      selectorType: SelectorType.ValuesSelector,
    },
    {
      title: "HTTP status code",
      tag: "span.attributes.http.status_code",
      isSearchable: true,
      selectorType: SelectorType.ValuesSelector,
    },
  ];

  const rangeSliderSupported = window.localStorage.getItem("rangeSliderSupported") === "true";
  if (!rangeSliderSupported) {
    tags = tags.filter(tagOption => tagOption.selectorType === SelectorType.RangeSlider);
  }

  return (
    <Paper sx={{ overflowY: "auto", overflowX: "hidden" }}>
      <Stack spacing="2px" sx={styles.sideTagBar}>
        {tags.map((t) => {
          return t.selectorType === SelectorType.ValuesSelector ? (
            <TagValuesSelector
              title={t.title}
              tag={t.tag}
              searchable={t.isSearchable}
            />
          ) : (
            <NumericTagSlider tag={t.tag} title={t.title} />
          );
        })}
      </Stack>
    </Paper>
  );
};
