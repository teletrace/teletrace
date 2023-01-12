/**
The MIT License (MIT)

Copyright (c) 2014 Call-Em-All
Modifications copyright (C) 2022 Cisco Systems, Inc.
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Delete } from "../ResourceIcon";

function BasicTooltip() {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        width: "100%",
      }}
    >
      <Typography variant="subtitle1" sx={{ color: "primary.dark" }}>
        Basic tooltip
      </Typography>
      <Box>
        <Tooltip title="Delete">
          <IconButton>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

function PositionedTooltips() {
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          alignItems: "center",
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "primary.dark" }}>
          Positioned tooltips
        </Typography>
        <Box sx={{ width: 500 }}>
          <Stack direction="row" justifyContent="center">
            <Tooltip title="Add" placement="top-start">
              <Button>tooltip top-start</Button>
            </Tooltip>
            <Tooltip title="Add" placement="top">
              <Button>tooltip top</Button>
            </Tooltip>
            <Tooltip title="Add" placement="top-end">
              <Button>tooltip top-end</Button>
            </Tooltip>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack spacing={2}>
              <Tooltip title="Add" placement="left-start">
                <Button>left-start</Button>
              </Tooltip>
              <Tooltip title="Add" placement="left">
                <Button>left</Button>
              </Tooltip>
              <Tooltip title="Add" placement="left-end">
                <Button>left-end</Button>
              </Tooltip>
            </Stack>
            <Stack alignItems="flex-end" spacing={2}>
              <Tooltip title="Add" placement="right-start">
                <Button>right-start</Button>
              </Tooltip>
              <Tooltip title="Add" placement="right">
                <Button>right</Button>
              </Tooltip>
              <Tooltip title="Add" placement="right-end">
                <Button>right-end</Button>
              </Tooltip>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="center">
            <Tooltip title="Add" placement="bottom-start">
              <Button>tooltip bottom-start</Button>
            </Tooltip>
            <Tooltip title="Add" placement="bottom">
              <Button>tooltip bottom</Button>
            </Tooltip>
            <Tooltip title="Add" placement="bottom-end">
              <Button>tooltip bottom-end</Button>
            </Tooltip>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

function ArrowTooltips() {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        width: "100%",
      }}
    >
      <Typography variant="subtitle1" sx={{ color: "primary.dark" }}>
        Arrow tooltip
      </Typography>
      <span style={{ display: "flex" }}>
        <Tooltip title="Add" arrow>
          <span>
            <Button sx={{ display: "inline-block" }}>Arrow</Button>
          </span>
        </Tooltip>
      </span>
    </Box>
  );
}

export default {
  component: Tooltip,
  title: "Tooltip",
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = () => (
  <Box
    sx={{
      alignContent: "center",
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
    }}
  >
    <BasicTooltip />
    <Divider sx={{ margin: "14px 0", width: "100%" }} />
    <PositionedTooltips />
    <Divider sx={{ margin: "14px 0", width: "100%" }} />
    <ArrowTooltips />
  </Box>
);

export const Primary = Template.bind({});
