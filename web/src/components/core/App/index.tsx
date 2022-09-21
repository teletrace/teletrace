import { ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import NavConfig, { NavigationConfig } from "../../../layouts/NavConfig";
import DashboardLayout from "../../../layouts/DashboardLayout";
import theme from "../../../styles/theme";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <DashboardLayout />

      <Routes>
        {NavConfig.map((route: NavigationConfig) => (
          <Route path={route.path} key={route.path} element={route.mycomp} />
        ))}
      </Routes>
    </ThemeProvider>
  );
}
