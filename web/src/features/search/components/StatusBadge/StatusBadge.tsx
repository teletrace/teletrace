import { Badge } from "@mui/material";

import styles from "./styles";

export interface StatusBadgeProps {
  color?:
    | "primary"
    | "secondary"
    | "default"
    | "error"
    | "info"
    | "success"
    | "warning"
    | undefined;
  text: string;
  customColor?: string;
}

export function StatusBadge({ color, text, customColor }: StatusBadgeProps) {
  return (
    <Badge
      variant="dot"
      sx={{
        "& .MuiBadge-anchorOriginTopLeftRectangular": {
          ...(!color && customColor && { background: customColor }),
          ...styles.badge,
        },
      }}
      anchorOrigin={{
        horizontal: "left",
        vertical: "top",
      }}
      invisible={false}
      color={color}
    >
      <span style={styles.badgeText}>{text}</span>
    </Badge>
  );
}
