import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

import { styles } from "./styles";

interface ServiceSpanTagsAttributesTitleProps {
  title: string;
  content: number | string | boolean;
}

export const ServiceSpanTagsAttributes = ({
  title,
  content,
}: ServiceSpanTagsAttributesTitleProps) => {
  return (
    <AccordionDetails sx={styles.accordionDetails}>
      <Typography sx={styles.typography}>{title}</Typography>
      <Typography sx={{ ...styles.typography, ...styles.typographyBold }}>
        {content.toString()}
      </Typography>
    </AccordionDetails>
  );
};
