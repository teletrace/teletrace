export const styles = {
  nodeBox: {
    display: "flex",
    flexFlow: "column nowrap",
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
    "&:hover": {
      cursor: "pointer",
    },
  },
  nodeIconBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 1.5,
    width: "fit-content",
    height: "fit-content",
    background: "transparent",
    border: 1,
    borderColor: "#5a5b61",
    borderRadius: 8,
    marginBottom: "auto",
  },
  nodeTextContainer: {
    textAlign: "center",
  },
  nodeName: {
    color: "#E9EAF1",
    fontWeight: 600,
    fontSize: 16,
  },
  nodeService: {
    color: "#B6B7BE",
    fontWeight: 500,
    fontSize: 14,
  },
};
