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
    | "warning";

  text: string;
  customColor?: string;
}

export function StatusBadge({
  color,
  text,
  customColor = "white",
}: StatusBadgeProps) {
  return (
    <Badge
      variant="dot"
      sx={styles.badge(color ?? customColor)}
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
