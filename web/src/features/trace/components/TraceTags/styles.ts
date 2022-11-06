const styles = {
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
    fontSize: "22px",
    marginRight: "23px",
  },
  accordionIconsBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: "17px",
  },
  accordionArrowIcon: { fontSize: "medium", margin: "0 8px", color: "#96979E" },
  accordionNodeIcon: { width: "25px", height: "22px" },
  accordionSummary: {
    display: "flex",
    flexDirection: "row-reverse",
    width: "100%",
    height: "60px",
    alignitems: "center",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
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
