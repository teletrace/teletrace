const styles = {
  edgeStyle: {
    edgeLabelContainer: {
      position: "absolute",
      background: "#1e1e1e",
    },

    timeContainer: {
      color: "#ffffff",
      marginLeft: "-0.313rem",
    },

    counterContainer: {
      background: "#3b3c42",
      border: "0.063rem solid #96979e",
      borderRadius: "0.125rem",
      position: "absolute",
    },
  },
  nodeStyle: {
    nodeBox: {
      display: "flex",
      flexFlow: "column nowrap",
      justifyContent: "center",
      alignItems: "center",
    },
    nodeIconBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      padding: "12px",
      width: "56px",
      height: "56px",
      background: "transparent",
      border: "1px solid #5a5b61",
      borderRadius: "32px",
      marginBottom: "5px",
    },
    nodeText: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    textContainer: {
      height: 24,
      fontWeight: 600,
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      letterSpacing: 0.15,
      justifyContent: "center",
      color: "#e9eaf1",
    },
  },
};

export default styles;
