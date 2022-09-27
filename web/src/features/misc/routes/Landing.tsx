import { GitHub } from "@mui/icons-material";
import { Box, Container, Link, Stack, Typography } from "@mui/material";

import { Head } from "@/components/Head";

export const Landing = () => {
  const url = "https://github.com/epsagon/lupa";

  return (
    <>
      <Head description="Welcome to bulletproof react" />
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            About Lupa
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            Lupa is an open source tool for track, analyze and view tracing.
          </Typography>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Link href={url} target="_blank">
              <GitHub />
            </Link>
          </Stack>
        </Container>
      </Box>
    </>
  );
};
