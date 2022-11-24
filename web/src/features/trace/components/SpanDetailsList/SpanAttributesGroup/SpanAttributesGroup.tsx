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
}

export const SpanAttributesGroup = ({
  title,
  attributes,
}: SpanAttributesGroupProps) => {
  const [expanded, setExpanded] = useState(false);

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
