const styles = {
  expandedRow: {
    backgroundColor: "#2B2D32",
  },
  notExpandedRow: {
    backgroundColor: "#1B1C21",
  },
  mainPaper: {
    width: "100%",
    backgroundColor: "black",
  },
  mainAccordion: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderRadius: "8px",
    marginBottom: "8px",
    "&::before": {
      display: "none",
    },
  },
  accordionExpandIcon: {
    color: "#FFFFFF",
    fontSize: "15px",
  },
  accordionIconsBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: "17px",
  },
  accordionArrowIcon: { fontSize: "22px", margin: "0 8px", color: "#96979E" },
  accordionFirstNodeIcon: { marginLeft: "23px", width: "25px", height: "22px" },
  accordionNodeIcon: { width: "25px", height: "22px" },
  accordionSummary: {
    display: "flex",
    flexDirection: "row-reverse",
    width: "100%",
    height: "80px",
    alignitems: "center",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
  },
  accordionTitleTypography: {
    margin: "0",
    fontWeight: "700",
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "0.15px",
    marginBottom: "8px",
  },
  accordionSummaryTypography: {
    fontSize: "12px",
    fontWeight: "500",
    letterSpacing: "0.4px",
    color: "#B6B7BE",
  },
  accordionInnerTypography: {
    margin: "0 4px",
  },
};

export default styles;
