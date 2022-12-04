/**
 * Copyright 2022 Epsagon
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
  Avatar,
  Chip,
  IconButton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";

import { Close, Delete, Face } from "../ResourceIcon";

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

  const handleClose = () => {
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
            <TableCell>Hovered</TableCell>
            <TableCell sx={{ width: "100%" }}>
              <Stack direction="row" spacing={4} alignItems="center">
                <Chip
                  label="Hovered"
                  id="hovered"
                  size="small"
                  onClick={handleClick}
                  {...args}
                />
                <Chip
                  id="hovered"
                  label="Hovered"
                  onClick={handleClick}
                  {...args}
                />
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
                <Chip sx={{ display: "flex" }} icon={<Face />} {...args} />
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

const parameters = {
  pseudo: {
    hover: ["#hovered"],
  },
};

Outlined.parameters = parameters;

Filled.parameters = parameters;

Filled.args = {
  variant: "filled",
};

Outlined.args = {
  variant: "outlined",
};
