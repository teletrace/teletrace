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
