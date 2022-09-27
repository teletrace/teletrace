import { Toolbar, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";

import { AppBar } from "@/components/Elements/AppBar";
export type HeadProps = {
  title?: string;
  description?: string;
};

export const Head = ({ title = "", description = "" }: HeadProps = {}) => {
  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap>
          Lupa
        </Typography>
      </Toolbar>
      <Helmet title={title ? `${title} | Lupa` : undefined} defaultTitle="Lupa">
        <meta name="description" content={description} />
      </Helmet>
    </AppBar>
  );
};
