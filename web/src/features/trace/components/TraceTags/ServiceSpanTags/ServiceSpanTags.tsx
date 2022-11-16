import AccordionDetails from "@mui/material/AccordionDetails";

import { Attributes } from "@/types/span";

import { ServiceSpanProps } from "../ServiceSpan/ServiceSpan";
import ServiceSpanTagsAttributesList from "../ServiceSpanTagsAttributesList";
import { styles } from "./styles";

export const ServiceSpanTags = ({ span }: ServiceSpanProps) => {
  const record: Attributes = { application: "blog-site-prod" };
  return (
    <AccordionDetails sx={styles.accordionDetails}>
      <ServiceSpanTagsAttributesList
        tagsTitle="Basic"
        tagsContent={record}
      />
      <ServiceSpanTagsAttributesList
        tagsTitle="Attributes"
        tagsContent={span.span.attributes}
      />
    </AccordionDetails>
  );
};
