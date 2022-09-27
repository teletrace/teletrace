import { GitHub } from "@mui/icons-material";
import {
  Box,
  Container,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import { Head } from "@/components/Head";
import { LUPA_REPOSITORY_URL } from "@/config";

export const Landing = () => {
  const theme = useTheme();

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
            <Link
              aria-label="Opening new tab to the repository"
              href={LUPA_REPOSITORY_URL}
              target="_blank"
            >
              <GitHub
                fontSize="large"
                sx={{ color: theme.palette.primary.light }}
              />
            </Link>
          </Stack>
        </Container>
      </Box>
    </>
  );
};
