import { Box } from "@mui/material";
import React, { memo } from "react";

import IconInterface from "./interface/IconInterface";
import styles from "./styles";

const NodeIcon: React.FC<IconInterface> = (icon: IconInterface) => {
  return (
    <Box sx={styles.nodeIconStyle.nodeIcon}>
      <img src={icon.path} alt={icon.name} width={27.48} height={27.48}></img>
    </Box>
  );
};

export default memo(NodeIcon);
