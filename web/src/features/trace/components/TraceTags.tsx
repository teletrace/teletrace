import { Box, Paper, Typography } from "@mui/material";

export const TraceTags = () => {
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
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        }}
      />
      <Typography>Tags go here</Typography>
    </Paper>
  );
};
