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
  const messasgeEmpty = errorMessage === "";

  useEffect(() => {
    if (containerRef.current !== null) {
      const { clientHeight, scrollHeight } = containerRef.current;
      if (containerRef.current) {
        setShowButton(clientHeight !== scrollHeight);
      }
    }
  }, [containerRef]);

  return (
    <Box sx={styles.mainContainer}>
      <Box
        ref={containerRef}
        sx={expanded ? styles.textContainerExpanded : styles.textContainer}
      >
        <Typography sx={styles.typography}>
          {messasgeEmpty ? "No Error Message Found" : errorMessage}
        </Typography>
      </Box>
      {showButton && (
        <Box sx={{ marginTop: "5px" }}>
          <Button
            onClick={() => setExpanded(!expanded)}
            variant="text"
            sx={styles.readMoreButton}
            disableRipple
          >
            {expanded ? "Show Less" : "Read More"}
          </Button>
        </Box>
      )}
    </Box>
  );
};
