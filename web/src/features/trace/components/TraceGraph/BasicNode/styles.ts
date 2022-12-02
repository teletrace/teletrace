export const styles = {
  nodeBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 0,
    "&:hover": {
      cursor: "pointer",
    },
  },
  nodeIconBox: {
    height: "50px",
    width: "50px",
    borderRadius: "50%",
    border: "1px solid #5a5b61",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px",
  },
  nodeIcon: {
    height: "100%",
    width: "100%",
  },
  nodeName: {
    color: "#E9EAF1",
    fontWeight: 600,
    fontSize: "16px",
  },
  nodeService: {
    color: "#B6B7BE",
    fontWeight: 500,
    fontSize: "14px",
  },
};
