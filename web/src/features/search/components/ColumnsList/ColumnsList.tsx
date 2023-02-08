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

import { DragIndicator } from "@mui/icons-material";
import {
  IconButton,
  ListItemText,
  MenuItem,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";

import { DnDItem, DnDList } from "@/components/DnDList";
import { SearchField } from "@/components/SearchField";

import { styles } from "./styles";

export type ColumnListItemData = {
  name: string;
  id: string;
  isAlwaysSelected: boolean;
};

export type ColumnsListProps = {
  options: ColumnListItemData[];
  maxSelected: number;
  selectedOptionsIds: Array<string>;
  onSelectedColumnsChange: (columnsIds: Array<string>) => void;
};

export const ColumnsSelection = (
  selectedOptions: ColumnListItemData[],
  maxSelected: number
) => {
  return (
    <Stack flexDirection="row">
      <Typography sx={styles.columnsSelectionText} variant="caption">
        Select up to {maxSelected} columns
      </Typography>
      <Typography
        sx={styles.columnsSelectionText}
        variant="caption"
      >{`(${selectedOptions.length}/${maxSelected})`}</Typography>
    </Stack>
  );
};

export const ColumnsList = ({
  options,
  maxSelected,
  selectedOptionsIds,
  onSelectedColumnsChange,
}: ColumnsListProps) => {
  const [search, setSearch] = useState<string>("");
  // const [selectedOptions, setSelectedOptions] = useState<ColumnListItemData[]>(options.filter( option => option.isAlwaysSelected))
  //TODO: handle changes in options
  // const selectedOptionsIds = new Set(selectedOptions.map(option => option.id))
  const selectedOptions: ColumnListItemData[] = [];
  for (const optId of selectedOptionsIds) {
    const opt = options.find((o) => o.id === optId);
    if (opt) {
      selectedOptions.push(opt);
    }
  }

  // if an option is in the selected but not in all options
  if (selectedOptions.length != selectedOptionsIds.length) {
    onSelectedColumnsChange(
      selectedOptions.filter((opt) => opt != undefined).map((opt) => opt.id)
    );
  }
  const onDeselectOption = (option: ColumnListItemData) => {
    const index = selectedOptionsIds.findIndex((x) => option.id === x);
    if (index !== -1) {
      onSelectedColumnsChange([
        ...selectedOptionsIds.slice(0, index),
        ...selectedOptionsIds.slice(index + 1),
      ]);
    }
  };
  const onSelectOption = (option: ColumnListItemData) => {
    onSelectedColumnsChange([...selectedOptionsIds, option.id]);
  };
  const isDisabledOption = (option: ColumnListItemData) => {
    const isSelected = selectedOptionsIds.includes(option.id);
    return (
      option.isAlwaysSelected ||
      (!isSelected && selectedOptionsIds.length === maxSelected)
    );
  };

  const selectedFilteredOptions = selectedOptions.filter((opt) =>
    opt.name.includes(search)
  );

  const onItemMove = (
    selectedFilteredOptions: ColumnListItemData[],
    startIndex: number,
    endIndex: number
  ) => {
    const newSelectedOptionsIds: Array<string> = [...selectedOptionsIds];
    //find the source and dest in the unfiltered list
    const origStart = selectedOptions.findIndex(
      (item) => item === selectedFilteredOptions[startIndex]
    );
    const origEnd = selectedOptions.findIndex(
      (item) => item === selectedFilteredOptions[endIndex]
    );
    const [removed] = newSelectedOptionsIds.splice(origStart, 1);
    newSelectedOptionsIds.splice(origEnd, 0, removed);
    onSelectedColumnsChange(newSelectedOptionsIds);
  };

  const unselectedMenuOptions = options
    .filter(
      (opt) => opt.name.includes(search) && !selectedOptionsIds.includes(opt.id)
    )
    .map((opt) => (
      <SwitchListItem
        key={opt.id}
        name={opt.name}
        selected={false}
        disabled={isDisabledOption(opt)}
        onSelectedChange={(value) =>
          value ? onSelectOption(opt) : onDeselectOption(opt)
        }
      />
    ));
  return (
    <>
      <Stack sx={styles.header}>
        <SearchField value={search} onChange={setSearch} />
        {ColumnsSelection(selectedOptions, maxSelected)}
      </Stack>
      <DnDList
        droppableId="columnsList"
        onMoveItem={(startIndex, endIndex) =>
          onItemMove(selectedFilteredOptions, startIndex, endIndex)
        }
      >
        {selectedFilteredOptions.map((opt: ColumnListItemData, index) => (
          <DnDItem
            id={opt.id}
            key={opt.id}
            index={index}
            render={(draggableHandleProps) => (
              <SwitchListItem
                key={opt.id}
                name={opt.name}
                selected={true}
                disabled={isDisabledOption(opt)}
                draggableHandleProps={draggableHandleProps}
                onSelectedChange={(value) =>
                  value ? onSelectOption(opt) : onDeselectOption(opt)
                }
              />
            )}
          />
        ))}
      </DnDList>
      {unselectedMenuOptions}
    </>
  );
};

type SwitchListItemProps = {
  name: string;
  disabled: boolean;
  selected: boolean;
  draggableHandleProps?: DraggableProvidedDragHandleProps | null | undefined;
  onSelectedChange: (value: boolean) => void;
};

const SwitchListItem = ({
  name,
  disabled,
  selected,
  draggableHandleProps,
  onSelectedChange,
}: SwitchListItemProps) => {
  return (
    <MenuItem sx={styles.listItem}>
      <Switch
        size="small"
        disabled={disabled}
        checked={selected}
        onChange={(e) => onSelectedChange(e.target.checked)}
      />
      <ListItemText sx={styles.listItemText}>
        <Typography noWrap={true}>{name}</Typography>
      </ListItemText>
      {selected && (
        <IconButton
          aria-label="drag"
          sx={{ padding: "6px" }}
          {...draggableHandleProps}
        >
          {" "}
          <DragIndicator sx={styles.dragIndicator} />
        </IconButton>
      )}
    </MenuItem>
  );
};
