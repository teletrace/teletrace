import { Box, Paper, Typography } from "@mui/material";

export const TraceGraph = () => {
  return (
    <Paper
      sx={{
        position: "relative",
        height: 500,
        width: 550,
      }}
    >
      <Box
        sx={{
          position: "relative",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        }}
      />
      <Typography>Graph goes here</Typography>
    </Paper>
  );
};
