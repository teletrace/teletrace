import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#1B1C21",
          height: "60px",
        },
      },
    },
  },
});
