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

import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  SxProps,
  Theme,
} from "@mui/material";
import { Fragment, ReactNode } from "react";

import { styles } from "./styles";

export type CheckboxListOption = {
  value: string | number;
  label: ReactNode;
};

export type CheckboxListProps = {
  value: Array<string | number>;
  options: Array<CheckboxListOption>;
  loading?: boolean;
  onChange?: (value: Array<string | number>) => void;
  sx?: SxProps<Theme>;
};

export const CheckboxList = ({
  value,
  options,
  onChange,
  sx,
  loading = false,
}: CheckboxListProps) => {
  const handleToggle = (opt: string | number) => {
    const currentIndex = value.indexOf(opt);
    const newChecked = [...value];

    if (currentIndex === -1) {
      newChecked.push(opt);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    onChange?.(newChecked);
  };

  if (loading)
    return (
      <Fragment>
        <Skeleton sx={styles.skeleton} />
        <Skeleton sx={styles.skeleton} />
        <Skeleton sx={styles.skeleton} />
      </Fragment>
    );

  return (
    <List sx={sx}>
      {options.map((opt, index) => (
        <Fragment key={index}>
          <ListItem sx={styles.listItem} disablePadding>
            <ListItemButton
              dense
              sx={styles.listItemButton}
              onClick={() => handleToggle(opt.value)}
            >
              <Checkbox
                disableRipple
                edge="start"
                checked={value.indexOf(opt.value) !== -1}
                inputProps={{ "aria-label": opt?.value.toString() }}
              />
              <ListItemText primary={opt.label} />
            </ListItemButton>
          </ListItem>
        </Fragment>
      ))}
    </List>
  );
};
