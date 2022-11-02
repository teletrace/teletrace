import { Divider } from "@mui/material";
import { Stack } from "@mui/system";

import { Head } from "@/components/Head";

import { SearchBar } from "../components/SearchBar";
import { SpanTable } from "../components/SpanTable/index";

export const SpanSearch = () => {
  return (
    <>
      <Head
        title="Span Search"
        description="Designated page to span search's flow graph and timeline"
      />
      <Stack
        direction="row"
        divider={<Divider orientation="horizontal" flexItem />}
        spacing={2}
      >
        <Stack
          direction="column"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={1}
          justifyContent="space-between"
          sx={{ minHeight: "0" }}
          flex={1}
        >
          <SearchBar />
          <SpanTable />
        </Stack>
      </Stack>
    </>
  );
};
