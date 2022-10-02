import { Toolbar, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";

import { AppBar } from "@/components/Elements/AppBar";
export type HeadProps = {
  title?: string;
  description?: string;
};

export const Head = ({ title = "", description = "" }: HeadProps = {}) => {
  return (
    <AppBar
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        gap: "1389px",

        position: "absolute",
        width: "1512px",
        height: "60px",
        left: "0px",
        top: "0px",

        background: "#1B1C21",
      }}
    >
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
