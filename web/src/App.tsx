import { CssBaseline, ThemeProvider } from "@mui/material";

import { AppProviders } from "@/providers/app";
import { AppRoutes } from "@/routes";
import { theme } from "@/styles";

export function App() {
  return (
    <AppProviders>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </AppProviders>
  );
}
