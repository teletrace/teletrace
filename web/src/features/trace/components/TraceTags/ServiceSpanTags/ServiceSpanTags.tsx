import AccordionDetails from "@mui/material/AccordionDetails";

import { Attributes } from "@/types/span";

import { ServiceSpanProps } from "../ServiceSpan/ServiceSpan";
import ServiceSpanTagsAttributesList from "../ServiceSpanTagsAttributesList";
import { styles } from "./styles";

export const ServiceSpanTags = ({ span }: ServiceSpanProps) => {
  const BASIC_TITLE = "Basic";
  const ATTRIBUTES_TITLE = "Attributes";

  const record: Attributes = { application: "blog-site-prod" };

  return (
    <AccordionDetails sx={styles.accordionDetails}>
      <ServiceSpanTagsAttributesList
        tagsTitle={BASIC_TITLE}
        tagsContent={record}
      />
      <ServiceSpanTagsAttributesList
        tagsTitle={ATTRIBUTES_TITLE}
        tagsContent={span.span.attributes}
      />
    </AccordionDetails>
  );
};
