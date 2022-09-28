import MuiAppBar, { AppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(() => ({
  ...{
    width: `100%`,
  },
}));
