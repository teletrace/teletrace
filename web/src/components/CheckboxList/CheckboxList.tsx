import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ReactNode } from "react";

export type CheckboxListOption = {
  value: string | number;
  label: ReactNode;
};

export type CheckboxListProps = {
  value: Array<string | number>;
  options: Array<CheckboxListOption>;
  onChange?: (value: Array<string | number>) => void;
};

export const CheckboxList = ({
  value,
  options,
  onChange,
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

  return (
    <List>
      {options.map((opt) => (
        <ListItem key={opt.value} disablePadding>
          <ListItemButton dense onClick={() => handleToggle(opt.value)}>
            <ListItemIcon>
              <Checkbox
                disableRipple
                edge="start"
                checked={value.indexOf(opt.value) !== -1}
              />
            </ListItemIcon>
            <ListItemText primary={opt.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
