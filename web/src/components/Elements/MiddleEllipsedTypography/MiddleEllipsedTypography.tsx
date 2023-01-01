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
import { Typography, TypographyProps } from "@mui/material";
import { useEffect, useRef } from "react";

interface MiddleEllipsedTypographyProps extends TypographyProps {
  text: string;
  ellipsisString?: string;
}

export const MiddleEllipsedTypography = ({
  text,
  ellipsisString = "...",
  ...other
}: MiddleEllipsedTypographyProps) => {
  const typographyRef = useRef<HTMLInputElement>(null);

  const fitStringByTruncMiddle = (element: HTMLElement) => {
    for (
      let i = 1;
      text.length - i > 2 && element.scrollWidth > element.offsetWidth;
      i++
    ) {
      const pivot = Math.floor(text.length / 2);
      element.innerText = `${text.substring(0, pivot - i)} \
                           ${ellipsisString} \
                           ${text.substring(text.length - pivot + i)}`;
    }
  };

  const isOverflow = (element: HTMLElement): boolean =>
    element.scrollWidth > element.offsetWidth;

  useEffect(() => {
    const typographyElement = typographyRef.current;
    if (!typographyElement) return;

    typographyElement.style.whiteSpace = "noWrap";
    typographyElement.style.overflow = "hidden";

    const handleResize = () => {
      if (isOverflow(typographyElement)) {
        fitStringByTruncMiddle(typographyElement);
      } else {
        typographyElement.innerText = text;
        if (isOverflow(typographyElement)) {
          fitStringByTruncMiddle(typographyElement);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Typography ref={typographyRef} {...other} component="span">
      {text}
    </Typography>
  );
};
