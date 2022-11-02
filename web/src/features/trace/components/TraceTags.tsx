import ArrowIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import styles from "../styles/styles.tags";
import { SvgIcon } from "@mui/material";
import { grey } from "@mui/material/colors";
import { padding } from "@mui/system";

interface TagsProps {
  spanAction: string;
  selectedSpanId: string;
  spanDuration: string;
  spanDateTime: string;
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
          sx={{ flexDirection: "row-reverse" }}
          style={{
            backgroundColor: expanded === props.selectedSpanId ? grey[800] : "",
          }}
        >
          <Grid container justifyContent="flex-start" alignItems="center">
            <Grid
              item
              sx={{
                flexDirection: "column",
                paddingLeft: 1.5,
                paddingRight: 1.5,
              }}
              style={{
                display: "center",
                alignSelf: "center",
                flexWrap: "wrap",
              }}
            >
              <SvgIcon
                sx={{ fontSize: 30 }}
                style={{ fill: "none", stroke: "#3F8624" }}
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </SvgIcon>
              <ArrowIcon
                sx={{
                  color: "#6E6F75",
                  fontSize: "medium",
                }}
              />
              <SvgIcon
                sx={{ fontSize: 30 }}
                style={{ fill: "none", stroke: "#D45B07" }}
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </SvgIcon>
            </Grid>
            <Grid
              item
              sx={{
                alignItems: "flex-start",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography sx={styles.accordionTitleTypography}>
                {props.spanAction}
              </Typography>
              <Typography variant="caption" sx={{ color: grey[300] }}>
                {`${props.spanDuration}ms`} | {props.spanDateTime}
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
    <Paper sx={{ width: "100%"}} >
      <TagsMainAccordion selectedSpanId="panel1" spanAction="Execute" spanDuration="192.45" spanDateTime="1:36.12.610 - Jan 24, 2022" />
      <TagsMainAccordion selectedSpanId="panel2" spanAction="Execute" spanDuration="192.45" spanDateTime="1:36.12.610 - Jan 24, 2022" />
    </Paper>
  );
};
