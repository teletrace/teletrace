import { colors } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import { errorLight, grey300, grey400, grey800, grey900, primary, primaryDisabled, primaryFocused, primaryHovered, secondary, secondaryDisabled, secondaryHovered, success } from "./colors";

export const theme = createTheme({
  palette: {
    background: {
      default: '#0B0B0D',
      paper: '#0B0B0D',
    },
    error: {
      main: errorLight,
    },
    mode: 'dark',
    primary: {
      contrastText: '#0B0B0D',
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
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 'normal',
      letterSpacing: '0.15px',
      lineHeight: '17px',
    },
    body2: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 'bold',
      letterSpacing: '0.5px',
      lineHeight: '17px',
    },
    button: {
      alignItems: 'center',
      display: 'flex',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 500,
      letterSpacing: '1.25px',
      lineHeight: '17px',
    },
    caption: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 500,
      letterSpacing: '0.4px',
      lineHeight: '15px',
    },
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '96px',
      fontStyle: 'normal',
      fontWeight: 300,
      letterSpacing: '-1.5px',
      lineHeight: '116px',
    },
    h2: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '60px',
      fontStyle: 'normal',
      fontWeight: 300,
      letterSpacing: '-1.5px',
      lineHeight: '73px',
    },
    h3: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '48px',
      fontStyle: 'normal',
      fontWeight: 'normal',
      letterSpacing: '-1.5px',
      lineHeight: '58px',
    },
    h4: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '34px',
      fontStyle: 'normal',
      fontWeight: 'normal',
      letterSpacing: '-1.5px',
      lineHeight: '41px',
    },
    h5: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '24px',
      fontStyle: 'normal',
      fontWeight: 'normal',
      letterSpacing: '0.5px',
      lineHeight: '29px',
    },
    h6: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '20px',
      fontStyle: 'normal',
      fontWeight: 500,
      letterSpacing: '0.15px',
      lineHeight: '24px',
    },
    overline: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '10px',
      fontStyle: 'normal',
      fontWeight: 500,
      letterSpacing: '1.5px',
      lineHeight: '12px',
    },
    // placeholder: {
    //   fontFamily: 'Inter, sans-serif',
    //   fontSize: '10px',
    //   fontStyle: 'normal',
    //   fontWeight: 500,
    //   letterSpacing: '1.5px',
    //   lineHeight: '12px',
    // },
    subtitle1: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 'normal',
      letterSpacing: '0.15px',
      lineHeight: '19px',
    },
    subtitle2: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 500,
      letterSpacing: '0.15px',
      lineHeight: '17px',
    },
  },
  typography: {
    fontFamily: ['"Inter"', "sans-serif"].join(","),
    fontSize: 12,
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          "&:first-of-type": {
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          },
          "&:last-of-type": {
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          },
          "&:before": {
            backgroundColor: "unset",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: grey900,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          "&:disabled": {
            backgroundColor: primaryDisabled,
          },
          "&:hover": {
            backgroundColor: primaryHovered,
          },
        },
        containedSecondary: {
          "&:disabled": {
            backgroundColor: secondaryDisabled,
          },
          "&:hover": {
            backgroundColor: secondaryHovered,
          },
        },
        outlined: {
          "&:disabled": {
            borderColor: primaryDisabled,
          },
          "&:hover": {
            borderColor: primaryHovered,
          },
        },
        outlinedSecondary: {
          "&:disabled": {
            borderColor: secondaryDisabled,
          },
          "&:hover": {
            borderColor: secondaryHovered,
          },
        },
        root: {
          borderRadius: "8px",
        },
        text: {
          color: primary,
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          'text-transform' : "unset !important",
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          '& .MuiButtonGroup-grouped:not(:last-of-type)': {
            borderRightColor: colors.common.white,
          },
          '& .MuiToggleButtonGroup-grouped:not(:last-of-type)': {
            borderRightColor: colors.common.white,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiDialog-paper': {
            padding: '8px 16px 12px 4px',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          fontSize: "14px",
          fontWeight: "normal",
          margin: "0px 4px",
        },
        notchedOutline: {
          border: `1px solid ${grey400}`,
          borderRadius: "8px",
        },
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: `1px solid ${primaryFocused}`,
            filter: `drop-shadow(0px 0px 2px ${primaryFocused})`, // not working
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: primaryHovered,
          },
          borderColor: primaryHovered,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: grey900,
          backgroundImage: "none",
          borderRadius: "8px",
          fontFamily: "Inter, sans-serif",
          fontStyle: "normal",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        arrow: {
          color: grey800,
        },
        tooltip: {
          backgroundColor: grey800,
          borderRadius: '4px',
          color: grey300,
          padding: '16px',
        },
      },
    },
  },
});
