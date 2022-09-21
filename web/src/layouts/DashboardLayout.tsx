import {
  Box,
  Toolbar,
  Typography,
  IconButton,
  ListItemText,
  ListItemIcon,
  CssBaseline,
  Divider,
  List,
  ListItemButton,
  ListItem,
} from "@mui/material";
import React, { ElementType, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { Menu, ChevronLeft } from "@mui/icons-material";
import NavConfig, { NavigationConfig } from "./NavConfig";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { StyledAppBar } from "../components/StyledAppBar";
import { StyledDrawer } from "../components/StyledDrawer";

function withRouter(Component: ElementType) {
  function ComponentWithRouterProp(props: any) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

const DashboardLayout = (props: any) => {
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
    return props.router.location.pathname === routeName ? true : false;
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

          <Typography variant="h5">OSS Tracing</Typography>
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
          {NavConfig.map((prop, key) => {
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
        {NavConfig.map((route: NavigationConfig) => (
          <Route path={route.path} key={route.path} element={route.mycomp} />
        ))}
      </Routes>
    </Box>
  );
};

export default withRouter(DashboardLayout);
