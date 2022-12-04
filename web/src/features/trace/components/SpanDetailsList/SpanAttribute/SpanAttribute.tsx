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
