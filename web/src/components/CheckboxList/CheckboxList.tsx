import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
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
};

export const CheckboxList = ({
  value,
  options,
  onChange,
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
    <List>
      {options.map((opt) => (
        <Fragment>
          <ListItem key={opt.value} disablePadding>
            <ListItemButton
              dense
              sx={styles.listItemButton}
              onClick={() => handleToggle(opt.value)}
            >
              <Checkbox
                disableRipple
                edge="start"
                checked={value.indexOf(opt.value) !== -1}
              />
              <ListItemText primary={opt.label} />
            </ListItemButton>
          </ListItem>
        </Fragment>
      ))}
    </List>
  );
};
