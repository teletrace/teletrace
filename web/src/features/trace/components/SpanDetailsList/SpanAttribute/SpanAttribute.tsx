/**
 * Copyright 2022 Cisco Systems, Inc.
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
import { useEffect, useRef, useState } from "react";

import { MiddleEllipsedTypography } from "@/components/Elements/MiddleEllipsedTypography";
("@/components/Elements/MiddleEllipsedTypography");
import { AttributeKey, AttributeValue } from "@/types/span";

import { styles } from "./styles";

interface SpanAttributeProps {
  attKey: AttributeKey;
  attValue: AttributeValue;
}

export const SpanAttribute = ({ attKey, attValue }: SpanAttributeProps) => {
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = useState(false);

  const typographyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const halveString = (
      element: HTMLElement,
      originalString: string,
      ellipsis = "..."
    ) => {
      let halvingFactor = 2;
      const maxHalvingFactor = 16;
      while (
        halvingFactor < maxHalvingFactor &&
        element.scrollWidth > element.offsetWidth
      ) {
        const pivot = Math.floor(originalString.length / halvingFactor) / 2;
        element.innerHTML = `${originalString.substring(0, pivot)}
          ${ellipsis}
          ${originalString.substring(originalString.length - pivot)}`;
        halvingFactor *= 2;
      }
    };
    const handleResize = () => {
      const typographyElement = typographyRef.current;
      if (!typographyElement) return;

      const parentElement = typographyElement.parentElement;
      if (!parentElement) return;

      const str = attValue.toString();
      if (typographyElement.scrollWidth > typographyElement.offsetWidth) {
        halveString(typographyElement, str);
      } else {
        typographyElement.textContent = attValue.toString();
        if (typographyElement.scrollWidth > typographyElement.offsetWidth) {
          halveString(typographyElement, str);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onCopyClick = (): void => {
    navigator.clipboard.writeText(attValue.toString());
    setIsCopyTooltipVisible(true);
  };

  return (
    <Box sx={styles.container}>
      <Typography component="span" sx={styles.key}>
        {attKey}
      </Typography>
      <MiddleEllipsedTypography text={attValue.toString()} sx={styles.value} />
      <Tooltip
        title="Copied!"
        placement="top"
        open={isCopyTooltipVisible}
        onOpen={() => setTimeout(() => setIsCopyTooltipVisible(false), 3000)}
      >
        <ContentCopy
          sx={styles.copy}
          className="copy-button"
          role="button"
          onClick={onCopyClick}
        />
      </Tooltip>
    </Box>
  );
};
