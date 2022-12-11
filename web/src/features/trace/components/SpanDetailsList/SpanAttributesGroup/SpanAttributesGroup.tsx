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

import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { Attributes } from "@/types/span";

import { SpanAttribute } from "../SpanAttribute";
import { styles } from "./styles";

interface SpanAttributesGroupProps {
  title: string;
  attributes: Attributes;
  startExpanded?: boolean;
}

export const SpanAttributesGroup = ({
  title,
  attributes,
  startExpanded = false,
}: SpanAttributesGroupProps) => {
  const [expanded, setExpanded] = useState(startExpanded);

  const handleChange = (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      disableGutters={true}
      sx={styles.accordion}
    >
      <AccordionSummary
        expandIcon={<ArrowRightIcon sx={styles.expandIcon} />}
        sx={styles.accordionSummary}
      >
        <Typography sx={styles.title}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.accordionDetails}>
        {Object.entries(attributes).map(([key, value]) => (
          <SpanAttribute key={key} attKey={key} attValue={value} />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};
