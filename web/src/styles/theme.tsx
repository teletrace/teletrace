import { colors } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import {
  errorActionColors,
  greyScaleColors,
  primaryActionColors,
  secondaryActionColors,
  statusColors,
} from "./colors";

export const theme = createTheme({
  palette: {
    background: {
      default: "#0B0B0D",
      paper: "#0B0B0D",
    },
    error: {
      contrastText: "#0B0B0D",
      main: statusColors.errorLight,
    },
    mode: "dark",
    primary: {
      contrastText: "#0B0B0D",
      main: primaryActionColors.primary,
    },
    secondary: {
      contrastText: "#0B0B0D",
      main: secondaryActionColors.secondary,
    },
    success: {
      main: statusColors.success,
    },
  },
  typography: {
    fontFamily: ['"Inter"', "sans-serif"].join(","),
    fontSize: 12,
    body1: {
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: "normal",
      letterSpacing: "0.15px",
      lineHeight: "17px",
    },
    body2: {
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: "bold",
      letterSpacing: "0.5px",
      lineHeight: "17px",
    },
    button: {
      alignItems: "center",
      display: "flex",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: 500,
      lineHeight: "20px",
    },
    caption: {
      fontStyle: "normal",
      fontWeight: 500,
      letterSpacing: "0.4px",
      lineHeight: "15px",
    },
    h1: {
      fontFamily: "Inter, sans-serif",
      fontSize: "96px",
      fontStyle: "normal",
      fontWeight: 300,
      letterSpacing: "-1.5px",
      lineHeight: "116px",
    },
    h2: {
      fontSize: "60px",
      fontStyle: "normal",
      fontWeight: 300,
      letterSpacing: "-1.5px",
      lineHeight: "73px",
    },
    h3: {
      fontSize: "48px",
      fontStyle: "normal",
      fontWeight: "normal",
      letterSpacing: "-1.5px",
      lineHeight: "58px",
    },
    h4: {
      fontSize: "34px",
      fontStyle: "normal",
      fontWeight: "normal",
      letterSpacing: "-1.5px",
      lineHeight: "41px",
    },
    h5: {
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
    // placeholder: {
    //   fontFamily: 'Inter, sans-serif',
    //   fontSize: '10px',
    //   fontStyle: 'normal',
    //   fontWeight: 500,
    //   letterSpacing: '1.5px',
    //   lineHeight: '12px',
    // },
    subtitle1: {
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "normal",
      letterSpacing: "0.15px",
      lineHeight: "19px",
    },
    subtitle2: {
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: 500,
      letterSpacing: "0.15px",
      lineHeight: "17px",
    },
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
          borderRadius: "0px",
          background: greyScaleColors.grey900,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        sizeSmall: {
          height: "24px",
          fontSize: "12px",
          lineHeight: "16px",
        },
        sizeLarge: {
          height: "40px",
        },
        contained: {
          "&:disabled": {
            backgroundColor: primaryActionColors.primaryDisabled,
          },
          "&:hover": {
            backgroundColor: primaryActionColors.primaryHovered,
          },
        },
        containedSecondary: {
          "&:disabled": {
            backgroundColor: secondaryActionColors.secondaryDisabled,
          },
          "&:hover": {
            backgroundColor: secondaryActionColors.secondaryHovered,
          },
        },
        containedError: {
          "&:disabled": {
            backgroundColor: errorActionColors.errorDisabled,
          },
          "&:hover": {
            backgroundColor: errorActionColors.errorHovered,
          },
        },
        outlined: {
          "&:disabled": {
            borderColor: primaryActionColors.primaryDisabled,
          },
          "&:hover": {
            borderColor: primaryActionColors.primaryHovered,
          },
        },
        outlinedSecondary: {
          "&:disabled": {
            borderColor: secondaryActionColors.secondaryDisabled,
          },
          "&:hover": {
            borderColor: secondaryActionColors.secondaryHovered,
          },
        },
        root: {
          borderRadius: "8px",
        },
        // text: {
        //   color: '#0B0B0D',
        // },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "text-transform": "unset !important",
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          "& .MuiButtonGroup-grouped:not(:last-of-type)": {
            borderRightColor: colors.common.white,
          },
          "& .MuiToggleButtonGroup-grouped:not(:last-of-type)": {
            borderRightColor: colors.common.white,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          "& .MuiDialog-paper": {
            padding: "8px 16px 12px 4px",
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
          border: `1px solid ${greyScaleColors.grey400}`,
          borderRadius: "8px",
        },
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: `1px solid ${primaryActionColors.primaryFocused}`,
            filter: `drop-shadow(0px 0px 2px ${primaryActionColors.primaryFocused})`, // not working
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: primaryActionColors.primaryHovered,
          },
          borderColor: primaryActionColors.primaryHovered,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: greyScaleColors.grey900,
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
          color: greyScaleColors.grey800,
        },
        tooltip: {
          backgroundColor: greyScaleColors.grey800,
          borderRadius: "4px",
          color: greyScaleColors.grey300,
          padding: "16px",
        },
      },
    },
  },
});
