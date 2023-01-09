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
import {
  SxProps,
  Theme,
  Tooltip,
  Typography,
  TypographyProps,
} from "@mui/material";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
interface MiddleTruncatedTypographyProps extends TypographyProps {
  text: string;
  separator?: string;
}

export const MiddleTruncatedTypography = ({
  text,
  separator = "...",
  ...other
}: MiddleTruncatedTypographyProps) => {
  const typographyRef = useRef<HTMLSpanElement>(null);

  const [tooltipTitle, setTooltipTitle] = useState("");

  const styles: SxProps<Theme> | undefined = {
    ...other.sx,
    whiteSpace: "nowrap",
    overflow: "hidden",
  };

  const fitStringByTruncMiddle = useCallback(
    (element: HTMLSpanElement) => {
      const pivot = Math.floor(text.length / 2);
      for (let i = 1; text.length - i > 2 && isOverflow(element); i++) {
        element.innerText = `${text.substring(0, pivot - i)} \
                           ${separator} \
                           ${text.substring(text.length - pivot + i)}`;
      }
    },
    [text, separator]
  );

  const isOverflow = (element: HTMLSpanElement): boolean =>
    element.scrollWidth > element.offsetWidth;

  useEffect(() => {
    const typographyElement = typographyRef.current;
    if (!typographyElement) return;

    const handleResize = () => {
      if (isOverflow(typographyElement)) {
        setTooltipTitle(text);
        fitStringByTruncMiddle(typographyElement);
      } else {
        typographyElement.innerText = text;
        setTooltipTitle("");
        if (isOverflow(typographyElement)) {
          setTooltipTitle(text);
          fitStringByTruncMiddle(typographyElement);
        }
      }
    };

    handleResize();

    const debouncedResize = debounce(handleResize, 100);
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, [text, fitStringByTruncMiddle]);

  return (
    <Tooltip title={tooltipTitle} followCursor={true} placement={"top"}>
      <Typography {...other} ref={typographyRef} sx={styles} component="span">
        {text}
      </Typography>
    </Tooltip>
  );
};
