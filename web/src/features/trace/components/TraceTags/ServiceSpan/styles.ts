const styles = {
  expandedRow: {
    backgroundColor: "#2B2D32",
    height: "80px",
    borderRadius: "0px",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
  },
  mainAccordion: {
    borderRadius: "8px",
    marginBottom: "8px",
  },
  accordionExpandArrowIcon: {
    color: "#FFFFFF",
    fontSize: "15px",
  },
  accordionIconsBox: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: "17px",
  },
  accordionArrowIcon: { fontSize: "16px", margin: "0 8px", color: "#96979E" },
  accordionFirstNodeIcon: { marginLeft: "23px", width: "22px", height: "22px" },
  accordionNodeIcon: { width: "22px", height: "22px" },
  accordionSummary: {
    flexDirection: "row-reverse",
    height: "60px",
    borderRadius: "8px",
    backgroundColor: "#1B1C21",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
  },
  accordionTitleTypography: {
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
