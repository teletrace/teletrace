import { colors } from "@mui/material";
import { createTheme } from "@mui/material/styles";

import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import {
  errorActionColors,
  primaryActionColors,
  secondaryActionColors,
  statusColors,
} from "./colors";

let theme = createTheme({
  palette: {
    mode: "dark",
    grey: {
      50: "#F1F2FA",
      100: "#E9EAF1",
      200: "#D9DAE1",
      300: "#B6B7BE",
      400: "#96979E",
      500: "#6E6F75",
      600: "#5A5B61",
      700: "#3B3C42",
      800: "#2B2D32",
      900: "#1B1C21",
      A100: "#0B0B0D",
    },
  },
});

theme = createTheme(theme, {
  palette: {
    primary: {
      contrastText: theme.palette.grey.A100,
      main: primaryActionColors.primary,
    },
    secondary: {
      contrastText: theme.palette.grey.A100,
      main: secondaryActionColors.secondary,
    },
    error: {
      contrastText: theme.palette.grey.A100,
      main: statusColors.errorLight,
    },
    success: {
      main: statusColors.success,
    },
    background: {
      default: theme.palette.grey.A100,
      paper: theme.palette.grey.A100,
    },
  },
  typography: {
    fontFamily: ['"Inter"', "sans-serif"].join(","),
  },
});

theme = createTheme(theme, {
  typography: {
    fontSize: 12,
    h1: {
      fontFamily: theme.typography.fontFamily,
      fontSize: "96px",
      fontStyle: "normal",
      fontWeight: 300,
      letterSpacing: "-1.5px",
      lineHeight: "116px",
    },
    h2: {
      fontFamily: theme.typography.fontFamily,
      fontSize: "60px",
      fontStyle: "normal",
      fontWeight: 300,
      letterSpacing: "-1.5px",
      lineHeight: "73px",
    },
    h3: {
      fontFamily: theme.typography.fontFamily,
      fontSize: "48px",
      fontStyle: "normal",
      fontWeight: "normal",
      letterSpacing: "-1.5px",
      lineHeight: "58px",
    },
    h4: {
      fontFamily: theme.typography.fontFamily,
      fontSize: "34px",
      fontStyle: "normal",
      fontWeight: "normal",
      letterSpacing: "-1.5px",
      lineHeight: "41px",
    },
    h5: {
      fontFamily: theme.typography.fontFamily,
      fontSize: "24px",
      fontStyle: "normal",
      fontWeight: "normal",
      letterSpacing: "0.5px",
      lineHeight: "29px",
    },
    h6: {
      fontFamily: theme.typography.fontFamily,
      fontSize: "20px",
      fontStyle: "normal",
      fontWeight: 500,
      letterSpacing: "0.15px",
      lineHeight: "24px",
    },
    subtitle1: {
      fontFamily: theme.typography.fontFamily,
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "normal",
      letterSpacing: "0.15px",
      lineHeight: "19px",
    },
    subtitle2: {
      fontFamily: theme.typography.fontFamily,
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: 500,
      letterSpacing: "0.15px",
      lineHeight: "20px",
    },
    body1: {
      fontFamily: theme.typography.fontFamily,
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: "normal",
      letterSpacing: "0.15px",
      lineHeight: "20px",
    },
    body2: {
      fontFamily: theme.typography.fontFamily,
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: "bold",
      letterSpacing: "0.5px",
      lineHeight: "20px",
    },
    button: {
      fontFamily: theme.typography.fontFamily,
      alignItems: "center",
      display: "flex",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: 500,
      lineHeight: "20px",
    },
    caption: {
      fontFamily: theme.typography.fontFamily,
      fontStyle: "normal",
      fontWeight: 500,
      letterSpacing: "0.4px",
      lineHeight: "15px",
    },
    overline: {
      fontFamily: theme.typography.fontFamily,
      fontSize: "10px",
      fontStyle: "normal",
      fontWeight: 500,
      letterSpacing: "1.5px",
      lineHeight: "12px",
    },
  },
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          display: "inline-block",
        },
      },
    },
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
          background: theme.palette.grey[900],
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        sizeSmall: {
          height: "24px",
          fontSize: "12px",
          lineHeight: "16px",
          padding: "4px 10px",
        },
        sizeMedium: {
          padding: "6px 12px",
        },
        sizeLarge: {
          height: "40px",
          fontSize: "14px",
          padding: "10px 16px",
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
          ".MuiButton-startIcon": {
            marginRight: "6px",
          },
          borderRadius: "8px",
          fontWeight: 500,
          letterSpacing: "0.02857em",
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          textTransform: "unset !important",
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
        paper: {
          backgroundColor: theme.palette.grey[800],
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          fontSize: "16px",
          lineHeight: "24px",
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          fontSize: "16px",
          lineHeight: "24px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "8px 24px 16px 24px",
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
        inputSizeSmall: {
          position: "relative",
        },
        notchedOutline: {
          border: `1px solid ${theme.palette.grey[400]}`,
          borderRadius: "8px",
        },
        root: {
          "&.Mui-focused": {
            ".MuiOutlinedInput-notchedOutline": {
              border: `1px solid ${primaryActionColors.primaryFocused}`,
            },
            ".MuiOutlinedInput-root": {
              filter: `drop-shadow(2px 4px 10px) ${primaryActionColors.primaryFocused}`, // not working
            },
          },
          "&:hover .MuiOutlinedInput-notchedOutline not(Mui-disabled)": {
            borderColor: primaryActionColors.primaryHovered,
          },
          borderColor: primaryActionColors.primaryHovered,
        },
        sizeSmall: {
          height: "32px",
          alignContent: "center",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        sizeSmall: {
          lineHeight: "15px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[900],
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
          color: theme.palette.grey[800],
        },
        tooltip: {
          fontSize: "0.75rem",
          backgroundColor: theme.palette.grey[800],
          borderRadius: "4px",
          color: theme.palette.grey[300],
          padding: "16px",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        valueLabel: {
          backgroundColor: theme.palette.grey[800],
          fontSize: "14px",
        },
        root: {
          "&.Mui-disabled": {
            color: theme.palette.grey[500],
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "white",
          paddingBottom: "8px",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: theme.palette.grey[800],
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[900],
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "0.75rem", //12px
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[700],
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
        label: {
          padding: "8px",
          fontWeight: 500,
        },
        labelSmall: {
          fontSize: "12px",
          lineHeight: "16px",
        },
        labelMedium: {
          dontSize: "14px",
          lineHeight: "20px",
        },
        icon: {
          color: "#FFFFFF",
        },
        deleteIcon: {
          color: "#FFFFFF",
        },
        avatar: {
          color: "#FFFFFF",
        },
        filled: {
          "&.MuiChip-colorDefault": {
            backgroundColor: secondaryActionColors.secondaryClicked,
          },
          "&:hover": {
            backgroundColor: secondaryActionColors.secondaryHovered,
          },
        },
        outlined: {
          "&.MuiChip-colorDefault": {
            borderColor: secondaryActionColors.secondaryHovered,
          },
          //  mui outlined clickable is defined using two classes, .MuiChip-clickable.MuiChip-outlined
          //  so in order to override default hover we need to use two `&` for the specificity to match
          "&&:hover": {
            backgroundColor: secondaryActionColors.secondaryDisabled,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&.MuiTableRow-head": {
            backgroundColor: theme.palette.grey[800],
          },
          "&.MuiTableRow-hover": {
            cursor: "pointer",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          "&.MuiTableCell-head": {
            color: theme.palette.grey[300],
            fontWeight: 500,
          },
          "&.MuiTableCell-body": {
            fontWeight: "normal",
          },
        },
      },
    },
  },
});

export { theme };
