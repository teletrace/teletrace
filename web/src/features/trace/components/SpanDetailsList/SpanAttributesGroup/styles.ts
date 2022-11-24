export const styles = {
  accordion: {
    boxShadow: "none",
  },
  accordionSummary: {
    flexDirection: "row-reverse",
    padding: "0px",
    marginLeft: "55px",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
  },
  expandIcon: {
    fontSize: "25px",
  },
  title: {
    marginLeft: "8px",
    fontWeight: "700",
  },
  accordionDetails: {
    display: "flex",
    flexDirection: "column",
    padding: "0",
  },
};
