import { ThemeProvider } from "@mui/material";
import DashboardLayout from "../../../layouts/DashboardLayout";
import theme from "../../../styles/theme";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <DashboardLayout />
    </ThemeProvider>
  );
}
