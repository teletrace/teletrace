import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";

import { styles } from "./styles";

interface SpanErrorDetailsProps {
  errorMessage: string;
}

export const SpanErrorDetails = ({ errorMessage }: SpanErrorDetailsProps) => {
  const containerRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    if (containerRef.current !== null) {
      const { clientHeight, scrollHeight } = containerRef.current;
      console.log("wddd");
      console.log(clientHeight);
      console.log(scrollHeight);
      if (containerRef.current) {
        setShowButton(clientHeight !== scrollHeight);
      }
    }
  }, [containerRef]);

  return (
    <Box ref={containerRef} sx={styles.mainContainer}>
      <Typography sx={styles.typography}>{"errorMessageerrorMessage errorMessageerrorMessageerrorMessageerrorMessageerrorMessageerror MessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessageerrorMessage"}</Typography>
      {/* {showButton && ( */}
        <Box sx={{marginTop: "5px"}}>
          <Button
            onClick={() => setExpanded(!expanded)}
            variant="text"
            sx={styles.readMoreButton}
            // sx={{'&:hover': {
            //   background: 'none',
            // }}}
            // disableRipple
          >
            {expanded ? "Show Less" : "Read More"}
          </Button>
        </Box>
      {/* )} */}
      {/* <Box sx={styles.readMoreSeparationLine} /> */}
    </Box>
  );
};
