/**
 * Copyright 2022 Epsagon
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    <Box
      component="main"
      padding={2}
      sx={{ flex: 1, height: "calc(100vh - 64px)" }}
    >
      {children}
    </Box>
  </Box>
);
