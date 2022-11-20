import {
  Stack,
  Chip,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Box,
  Typography,
  Avatar,
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";
import { Delete, Done, Face, Close, CloseOutlined } from "../ResourceIcon";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";

export default {
  component: Chip,
  title: "Chip",
} as ComponentMeta<typeof Chip>;

const Template: ComponentStory<typeof Chip> = (args) => {
  const [open, setOpen] = useState(false);
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);

  const handleClick = () => {
    setIsDeleteClicked(false);
    setOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteClicked(true);
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event) => {
    setOpen(false);
  };

  const snackbarActions = (
    <IconButton onClick={handleClose}>
      <Close />
    </IconButton>
  );

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={
          isDeleteClicked ? "you clicked delete" : "you clicked the chip"
        }
        action={snackbarActions}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell sx={{ width: "20%" }}>Basic</TableCell>
            <TableCell sx={{ width: "100%" }}>
              <Stack direction="row" spacing={4} alignItems="center">
                <Chip label="Small Chip" size="small" {...args} />
                <Chip label="Big Chip" {...args} />
              </Stack>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Clickable</TableCell>
            <TableCell sx={{ width: "100%" }}>
              <Stack direction="row" spacing={4} alignItems="center">
                <Chip
                  label="Clickable"
                  size="small"
                  onClick={handleClick}
                  {...args}
                />
                <Chip label="Clickable" onClick={handleClick} {...args} />
              </Stack>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Clickable and Deletable</TableCell>
            <TableCell sx={{ width: "100%" }}>
              <Stack direction="row" spacing={4} alignItems="center">
                <Chip
                  label="Small Deletable"
                  size="small"
                  onClick={handleClick}
                  onDelete={handleDelete}
                  deleteIcon={<Close />}
                  {...args}
                />
                <Chip
                  label="Big Deletable"
                  onClick={handleClick}
                  onDelete={handleDelete}
                  deleteIcon={<Close />}
                  {...args}
                />
                <Chip
                  label="Custom delete icon"
                  onClick={handleClick}
                  onDelete={handleDelete}
                  deleteIcon={<Delete />}
                  {...args}
                />
              </Stack>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Clickable Link</TableCell>
            <TableCell sx={{ width: "100%" }}>
              <Stack direction="row" spacing={4} alignItems="center">
                <Chip
                  label="Clickable Link"
                  component="a"
                  href="#"
                  clickable
                  variant={args.variant}
                />
              </Stack>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Icon and Text</TableCell>
            <TableCell sx={{ width: "100%" }}>
              <Stack direction="row" spacing={4}>
                <Chip avatar={<Avatar>M</Avatar>} label="Avatar" {...args} />
                <Chip icon={<Face />} label="With Icon" {...args} />
                <Chip icon={<Face />} label="With Icon" {...args} />
              </Stack>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>colorful</TableCell>
            <TableCell sx={{ width: "100%" }}>
              <Stack direction="row" spacing={4}>
                <Chip label="primary" color="primary" {...args} />
                <Chip label="secondary" color="secondary" {...args} />
                <Chip label="success" color="success" {...args} />
                <Chip label="warning" color="warning" {...args} />
                <Chip label="error" color="error" {...args} />
              </Stack>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>No Text</TableCell>
            <TableCell sx={{ width: "100%" }}>
              <Stack direction="row" alignItems="center" spacing={4}>
                <Chip icon={<Delete />} {...args} />
              </Stack>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export const Filled = Template.bind({});
export const Outlined = Template.bind({});

Filled.args = {
  variant: "filled",
};

Outlined.args = {
  variant: "outlined",
};
