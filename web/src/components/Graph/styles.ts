export const styles = {
  edgeStyle: {
    edgeLabelContainer: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      background: "#1e1e1e",
      textAlign: "center",
      width: "fit-content",
      height: "fit-content",
      margin: "auto",
      fontSize: 12,
      "&:hover": {
        cursor: "default",
      },
    },

    timeContainer: {
      color: "#ffffff",
    },

    counterContainer: {
      background: "#3b3c42",
      border: 1,
      borderColor: "#96979e",
      borderRadius: 0.5,
      padding: 1,
    },
  },
  nodeStyle: {
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
    nodeText: {
      fontWeight: 600,
      fontSize: 16,
      textAlign: "center",
    },
  },
};
