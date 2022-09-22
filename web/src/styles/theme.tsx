import { createTheme } from "@mui/material/styles";

const secondary = "#90A4AE";
const primary = "#00CDE7";
const success = "#27A17A";
const errorLight = "#EF5854";
const warning = "#F9D371";

type PaletteMode = "dark" | "light";

const theme = createTheme({
  palette: {
    background: {
      default: "#0B0B0D",
      paper: "#0B0B0D",
    },
    error: {
      main: errorLight,
    },
    warning: {
      main: warning,
    },
    mode: "dark" as PaletteMode,
    primary: {
      contrastText: "#0B0B0D",
      main: primary,
    },
    secondary: {
      main: secondary,
    },
    success: {
      main: success,
    },
  },
  typography: {
    body1: {
      fontFamily: "Inter, sans-serif",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: "normal",
      letterSpacing: "0.15px",
      lineHeight: "17px",
    },
    body2: {
      fontFamily: "Inter, sans-serif",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: "bold",
      letterSpacing: "0.5px",
      lineHeight: "17px",
    },
    button: {
      alignItems: "center",
      display: "flex",
      fontFamily: "Inter, sans-serif",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: 500,
      letterSpacing: "1.25px",
      lineHeight: "17px",
    },
    caption: {
      fontFamily: "Inter, sans-serif",
      fontSize: "12px",
      fontStyle: "normal",
      fontWeight: 500,
      letterSpacing: "0.4px",
      lineHeight: "15px",
    },
    fontFamily: "Inter, sans-serif",
    h1: {
      fontFamily: "Inter, sans-serif",
      fontSize: "96px",
      fontStyle: "normal",
      fontWeight: 300,
      letterSpacing: "-1.5px",
      lineHeight: "116px",
    },
    h2: {
      fontFamily: "Inter, sans-serif",
      fontSize: "60px",
      fontStyle: "normal",
      fontWeight: 300,
      letterSpacing: "-1.5px",
      lineHeight: "73px",
    },
    h3: {
      fontFamily: "Inter, sans-serif",
      fontSize: "48px",
      fontStyle: "normal",
      fontWeight: "normal",
      letterSpacing: "-1.5px",
      lineHeight: "58px",
    },
    h4: {
      fontFamily: "Inter, sans-serif",
      fontSize: "34px",
      fontStyle: "normal",
      fontWeight: "normal",
      letterSpacing: "-1.5px",
      lineHeight: "41px",
    },
    h5: {
      fontFamily: "Inter, sans-serif",
      fontSize: "24px",
      fontStyle: "normal",
      fontWeight: "normal",
      letterSpacing: "0.5px",
      lineHeight: "29px",
    },
    h6: {
      fontFamily: "Inter, sans-serif",
      fontSize: "20px",
      fontStyle: "normal",
      fontWeight: 500,
      letterSpacing: "0.15px",
      lineHeight: "24px",
    },
    overline: {
      fontFamily: "Inter, sans-serif",
      fontSize: "10px",
      fontStyle: "normal",
      fontWeight: 500,
      letterSpacing: "1.5px",
      lineHeight: "12px",
    },
    subtitle1: {
      fontFamily: "Inter, sans-serif",
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "normal",
      letterSpacing: "0.15px",
      lineHeight: "19px",
    },
    subtitle2: {
      fontFamily: "Inter, sans-serif",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: 500,
      letterSpacing: "0.15px",
      lineHeight: "17px",
    },
  },
});

export default theme;
