const styles = {
  badge: (color: string) => {
    return {
      "& .MuiBadge-anchorOriginTopLeftRectangular": {
        color: { background: color },
        height: "5px",
        maxHeight: "5px",
        maxWidth: "5px",
        minHeight: "5px",
        minWidth: "5px",
        padding: 0,
        top: "50%",
      },
    };
  },
  badgeText: {
    marginLeft: "10px",
  },
};

export default styles;
