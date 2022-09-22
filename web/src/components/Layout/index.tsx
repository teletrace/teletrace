import { ThemeProvider } from "@mui/material";

import theme from "@/styles/theme";

import DashboardLayout from "./DashboardLayout";

export default function Layout() {
  return (
    <ThemeProvider theme={theme}>
      <DashboardLayout />
    </ThemeProvider>
  );
}
