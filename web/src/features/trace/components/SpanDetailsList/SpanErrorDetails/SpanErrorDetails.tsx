/**
 * Copyright 2022 Cisco Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
          {errorMessage ? errorMessage : "No Error Message Found"}
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
