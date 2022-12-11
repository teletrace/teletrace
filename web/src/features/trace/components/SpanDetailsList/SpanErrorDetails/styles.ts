const textContainer = {
  maxHeight: "80px",
  overflow: "hidden",
  padding: "7px 150px 4px 45px",
};

export const styles = {
  mainContainer: {
    background: "#0B0B0D",
    borderLeft: "1px solid #EF5854",
  },
  textContainer,
  textContainerExpanded: {
    ...textContainer,
    overflow: "visible",
    maxHeight: "fit-content",
  },
  typography: {
    color: "#EF5854",
    lineHeight: "22px",
  },
  readMoreButton: {
    borderTop: "1px solid #6E6F75",
    width: "107px",
    fontWeight: "500",
    fontSize: "10px",
    marginLeft: "220px",
    lineHeight: "12px",
    letterSpacing: "1.5px",
    borderRadius: "0px",
    color: "#FFFFFF",
    "&:hover": {
      background: "none",
    },
  },
};
