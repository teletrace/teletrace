import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { Attributes } from "@/types/span";

import ServiceSpanTagsAttributes from "../ServiceSpanTagsAttributes";
import { styles } from "./styles";

interface ServiceSpanTagsAttributesProps {
  tagsTitle: string;
  tagsContent: Attributes;
}

export const ServiceSpanTagsAttributesList = ({
  tagsTitle,
  tagsContent,
}: ServiceSpanTagsAttributesProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion
      onChange={handleChange}
      sx={{
        width: "100%",
        padding: "0px 40px",
      }}
      style={{
        margin: "0",
        borderColor: "red",
      }}
    >
      <AccordionSummary
        expandIcon={<ArrowRightIcon sx={styles.arrowIcon} />}
        sx={styles.accodionSummary}
      >
        <Typography sx={styles.typography}>{tagsTitle}</Typography>
      </AccordionSummary>
      {Object.entries(tagsContent).map(([key, val]) => (
        <ServiceSpanTagsAttributes key={key} title={key} content={val} />
      ))}
    </Accordion>
  );
};
