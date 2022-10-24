import { AppBar, Box, Toolbar, Typography } from "@mui/material";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <Box
    sx={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap>
          Lupa
        </Typography>
      </Toolbar>
    </AppBar>
    <Box component="main" padding={2} sx={{ flex: 1, minHeight: 0 }}>
      {children}
    </Box>
  </Box>
);
