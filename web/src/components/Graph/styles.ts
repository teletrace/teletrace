const styles = {
  edgeStyle: {
    edgeLabelContainer: {
      position: "absolute",
      pointerEvents: "all",
      background: "#1e1e1e",
    },

    timeContainer: {
      color: "#ffffff",
      marginLeft: "-0.313rem",
    },

    counterContainer: {
      boxSizing: "border-box",
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
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      padding: "12px",
      gap: "10px",
      width: "56px",
      height: "56px",

      background: "#0b0b0d",

      border: "1px solid #5a5b61",
      boxShadow:
        "0px 11px 15px rgba(0, 0, 0, 0.2), 0px 9px 46px rgba(0, 0, 0, 0.12),0px 24px 38px rgba(0, 0, 0, 0.14)",
      borderRadius: "32px;",

      flex: "none;",
      order: "0;",
      flexGrow: "0",
      marginBottom: "5px;",
    },
    nodeText: {
      display: "flex;",
      flexDirection: "column;",
      flexWrap: "nowrap;",
      justifyContent: "center;",
    },
    textContainer: {
      height: 24,
      fontWeight: 600,
      fontSize: 16,
      lineHeight: 24,
      display: "flex",
      alignItems: "center",
      letterSpacing: 0.15,
      justifyContent: "center",
      color: "#e9eaf1",
    },
  },
};

export default styles;
