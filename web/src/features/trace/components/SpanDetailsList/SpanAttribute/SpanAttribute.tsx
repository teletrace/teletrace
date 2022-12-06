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

import { ContentCopy } from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";
import { useState } from 'react'

import { AttributeKey, AttributeValue } from "@/types/span";

import { styles } from "./styles";

interface SpanAttributeProps {
  attKey: AttributeKey;
  attValue: AttributeValue;
}

const onCopyClick = (value: string, setCopyClicked: (value: boolean) => void): void => {
  navigator.clipboard.writeText(value);
  setCopyClicked(true);
}

export const SpanAttribute = ({ attKey, attValue }: SpanAttributeProps) => {
  const [copyClicked, setCopyClicked] = useState(false);
  const [hoveringOver, setHoveringOver] = useState('')
  return (
    <Box sx={styles.container} onMouseEnter={() => setHoveringOver(attKey)} onMouseLeave={() => setHoveringOver('')}>
      <Typography component="span" sx={styles.key}>
        {attKey}
      </Typography>
      <Typography component="span" sx={styles.value}>
        {attValue.toString()}
      </Typography>
      {hoveringOver === attKey && (
        <Tooltip title="Copied!" placement="top" open={copyClicked} onOpen={() => setTimeout(() => setCopyClicked(false), 3000)}>
          <ContentCopy sx={styles.copy} onClick={() => onCopyClick(attValue.toString() || '', setCopyClicked) } />
        </Tooltip>
      )}
    </Box>
  );
};
