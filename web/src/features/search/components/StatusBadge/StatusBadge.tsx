/**
 * Copyright 2022 Epsagon
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
