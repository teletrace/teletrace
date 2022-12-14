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
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Popover,
  Typography,
} from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";

export default {
  component: Popover,
  title: "Popover",
} as ComponentMeta<typeof Popover>;

const Template: ComponentStory<typeof Popover> = (args, context) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Open Popover
      </Button>
      <Popover
        id={id}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: "left",
          vertical: "bottom",
        }}
        {...args}
        open={open}
      >
        {context?.parameters?.isDialog ? (
          <div>
            <DialogTitle id="alert-dialog-title">
              Use Google location service?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Let Google help apps determine location. This means sending
                anonymous location data to Google, even when no apps are
                running.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Disagree</Button>
              <Button onClick={handleClose} variant="contained" autoFocus>
                Agree
              </Button>
            </DialogActions>
          </div>
        ) : (
          <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
        )}
      </Popover>
    </div>
  );
};

export const Text = Template.bind({});
export const Dialog = Template.bind({});

Dialog.parameters = {
  isDialog: true,
};
