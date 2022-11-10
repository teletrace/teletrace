import { SxProps } from "@mui/material";
import { Theme } from "@mui/system";

export const styles: Record<string, SxProps<Theme>> = {
  accordionSummary: (theme) => ({
    flex: 1,
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },

    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  }),

  accordion: {
    "&:not(:last-child)": { borderBottom: 0 },
    "&:before": { display: "none" },
  },
};
