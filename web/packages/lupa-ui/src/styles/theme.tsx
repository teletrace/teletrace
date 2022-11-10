import { createTheme } from "@mui/material/styles";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

export const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: ['"Inter"', "sans-serif"].join(","),
    fontSize: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#1B1C21",
        },
      },
    },
  },
});
