import ArrowIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SvgIcon } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { grey } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useState } from "react";


import styles from "../styles/styles.tags";
import { FlattenedSpan, SpansMock } from "./spansMock";

interface TagsProps {
  span: FlattenedSpan;
  selectedSpanId: string
}

export const TraceTags = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  function TagsMainAccordion(props: TagsProps) {
    return (
      <Accordion
        expanded={expanded === props.selectedSpanId}
        onChange={handleChange(props.selectedSpanId)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={styles.accordionSummary}
          style={{
            backgroundColor: expanded === props.selectedSpanId ? grey[800] : "",
          }}
        >
          <Grid container justifyContent="flex-start" alignItems="center">
            <Grid item sx={styles.accordionGridIconsItem}>
              <SvgIcon sx={styles.accordionSvgIcon}>
                <path d={props.span.firstIconPath} />
              </SvgIcon>
              <ArrowIcon sx={styles.accordionArrowIcon} />
              <SvgIcon sx={styles.accordionSvgIcon}>
                <path d={props.span.secondIconPath} />
              </SvgIcon>
            </Grid>
            <Grid item sx={styles.accordionGridTypographyItem}>
              <Typography sx={styles.accordionTitleTypography}>
                {props.span.spanAction}
              </Typography>
              <Typography variant="caption" sx={{ color: grey[300] }}>
                {`${props.span.spanDuration}ms`} | {props.span.spanDateTime}
              </Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Add inner accordion</Typography>
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Paper sx={{ width: "100%" }}>
      <TagsMainAccordion
        span={SpansMock[0]}
        selectedSpanId="panel1"
      />
      <TagsMainAccordion
        span={SpansMock[1]}
        selectedSpanId="panel1"
      />
    </Paper>
  );
};
