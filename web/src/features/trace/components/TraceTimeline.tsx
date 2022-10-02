import { Box, Grid, Paper, Typography } from "@mui/material";

export const TraceTimeline = () => {
  return (
    <Paper
      sx={{
        position: "relative",
        height: 300,
        width: "100%",
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
      <Grid container>
        <Grid item md={6}>
          <Typography>Timeline goes here</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
