import { ChevronLeft, Menu } from "@mui/icons-material";
import {
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { ElementType, useState } from "react";
import {
  NavLink,
  Route,
  RouterProps,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { StyledAppBar } from "@/components/StyledAppBar";
import { StyledDrawer } from "@/components/StyledDrawer";
import navConfigMap, { NavigationConfig } from "@/routes/Navigation";

function withRouter(Component: ElementType) {
  function ComponentWithRouterProp(props: any) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

type DashboardProps = {
  router: RouterProps;
};

const DashboardLayout = (props: DashboardProps) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    };

  const activeRoute = (routeName: string) => {
    const { location } = props.router;
    return typeof location === "string"
      ? location === routeName
      : location.pathname === routeName;
  };

  return (
    <Box sx={{ flexGrow: 1, display: "flex" }}>
      <CssBaseline />
      <StyledAppBar position="absolute" open={open}>
        <Toolbar sx={{ pr: "24px" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <Menu />
          </IconButton>

          <Typography variant="h5">Lupa</Typography>
        </Toolbar>
      </StyledAppBar>

      <StyledDrawer
        variant="permanent"
        open={open}
        onClose={toggleDrawer(false)}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer(false)}>
            <ChevronLeft />
          </IconButton>
        </Toolbar>

        <Divider />

        <List component="nav">
          {navConfigMap.map((prop, key) => {
            return (
              <NavLink
                to={prop.path}
                style={{ textDecoration: "none" }}
                key={key}
              >
                <ListItemButton>
                  <ListItem selected={activeRoute(prop.path)}>
                    <ListItemIcon>{prop.icon}</ListItemIcon>
                    <ListItemText
                      sx={{ color: "white" }}
                      primary={prop.sidebarName}
                    />
                  </ListItem>
                </ListItemButton>
              </NavLink>
            );
          })}
        </List>
      </StyledDrawer>

      <Routes>
        {navConfigMap.map((route: NavigationConfig) => (
          <Route path={route.path} key={route.path} element={route.mycomp} />
        ))}
      </Routes>
    </Box>
  );
};

export default withRouter(DashboardLayout);
