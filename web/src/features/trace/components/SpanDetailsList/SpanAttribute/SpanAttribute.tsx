import { Box, Typography } from "@mui/material";

import { AttributeKey, AttributeValue } from "@/types/span";

import { styles } from "./styles";

interface SpanAttributeProps {
  attKey: AttributeKey;
  attValue: AttributeValue;
}

export const SpanAttribute = ({ attKey, attValue }: SpanAttributeProps) => {
  return (
    <Box sx={styles.container}>
      <Typography component="span" sx={styles.key}>
        {attKey}
      </Typography>
      <Typography component="span" sx={styles.value}>
        {attValue.toString()}
      </Typography>
    </Box>
  );
};
