import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Delete } from "../Icon";

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
        <Box>
          <Grid container justifyContent="center">
            <Grid item>
              <Tooltip title="Add" placement="top-start">
                <span>
                  <Button>top-start</Button>
                </span>
              </Tooltip>
              <Tooltip title="Add" placement="top">
                <span>
                  <Button>top</Button>
                </span>
              </Tooltip>
              <Tooltip title="Add" placement="top-end">
                <span>
                  <Button>top-end</Button>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid item xs={6}>
              <Tooltip title="Add" placement="right-start">
                <span>
                  <Button sx={{ display: "inline-block" }}>right-start</Button>
                </span>
              </Tooltip>
              <br />
              <Tooltip title="Add" placement="right">
                <span>
                  <Button sx={{ display: "inline-block" }}>right</Button>
                </span>
              </Tooltip>
              <br />
              <Tooltip title="Add" placement="right-end">
                <span>
                  <Button sx={{ display: "inline-block" }}>right-end</Button>
                </span>
              </Tooltip>
            </Grid>
            <Grid
              item
              container
              xs={6}
              alignItems="flex-end"
              direction="column"
            >
              <Grid item>
                <Tooltip title="Add" placement="left-start">
                  <span>
                    <Button>left-start</Button>
                  </span>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Add" placement="left">
                  <span>
                    <Button>left</Button>
                  </span>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Add" placement="left-end">
                  <span>
                    <Button>left-end</Button>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid item>
              <Tooltip title="Add" placement="bottom-start">
                <span>
                  <Button>bottom-start</Button>
                </span>
              </Tooltip>
              <Tooltip title="Add" placement="bottom">
                <span>
                  <Button>bottom</Button>
                </span>
              </Tooltip>
              <Tooltip title="Add" placement="bottom-end">
                <span>
                  <Button>bottom-end</Button>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
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
