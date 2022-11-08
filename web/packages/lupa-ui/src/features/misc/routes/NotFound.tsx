import { Box, Typography } from "@mui/material";

export const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Typography variant="h1">404</Typography>
    </Box>
  );
};
