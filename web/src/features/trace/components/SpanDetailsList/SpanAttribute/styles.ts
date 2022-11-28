const ellipsisOverflow = {
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const styles = {
  container: {
    display: "flex",
    padding: "11px 36px 11px 87px",
    "&:hover": {
      backgroundColor: "#2B2D32",
    },
  },
  key: {
    flex: "0 0 45%",
    fontWeight: "400",
    marginRight: "10px",
    ...ellipsisOverflow,
  },
  value: {
    fontWeight: "700",
    ...ellipsisOverflow,
  },
};
