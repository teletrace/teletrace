import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import styles from "../styles/styles.tags";

export const TraceTags = () => {
  const title = `Execute`;
  const body = `192.25ms | 1:36:12.610 - Jan 24, 2022`;

  function TagsSubAccordion() {
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ flexDirection: "row-reverse" }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", paddingLeft: 1 }}
          >
            Basic
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid
            container
            sx={styles.accordionGridContainer}
            spacing={2}
            columns={16}
          >
            <Grid item sx={styles.accordionGridItem} xs={8} textAlign="center">
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {title}
              </Typography>
            </Grid>
            <Grid sx={styles.accordionGridItem} xs={8}>
              <Typography variant="caption">{body}</Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  }

  function TagsMainAccordion() {
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ flexDirection: "row-reverse" }}
        >
          <DeleteIcon sx={{ alignSelf: "center" }} />
          <Grid container sx={styles.accordionGridContainer}>
            <Grid item sx={styles.accordionGridItem}>
              <Typography sx={styles.accordionTitleTypography}>
                {title}
              </Typography>
            </Grid>
            <Grid item width="100%" sx={styles.accordionGridItem}>
              <Typography sx={styles.accordionBodyTypography}>
                {body}
              </Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <TagsSubAccordion />
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Paper sx={{ width: "100%" }}>
      <TagsMainAccordion />
      <TagsMainAccordion />
    </Paper>
  );
};
