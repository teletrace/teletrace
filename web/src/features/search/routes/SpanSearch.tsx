import { Divider } from "@mui/material";
import { Stack } from "@mui/system";

import { Head } from "@/components/Head";

import { FilterBar } from "../components/FilterBar";
import { SearchBar } from "../components/SearchBar";
import { SpanTable } from "../components/SpanTable/SpanTable";

export const SpanSearch = () => {
  return (
    <>
      <Head title="Span Search" />
      <Stack
        className="span-search"
        direction="row"
        divider={<Divider orientation="horizontal" flexItem />}
        spacing={1}
        sx={{ height: "100%" }}
      >
        <Stack className="filters" direction="column" sx={{ height: "100%" }}>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            sx={{ minHeight: "0" }}
          >
            <FilterBar />
          </Stack>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            sx={{ minHeight: "0" }}
          >
            <FilterBar />
          </Stack>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            sx={{ minHeight: "0" }}
          >
            <FilterBar />
          </Stack>
        </Stack>

        <Stack
          className="search"
          direction="column"
          spacing={2}
          sx={{ height: "100%" }}
        >
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            justifyContent="space-between"
            sx={{ minHeight: "0" }}
          >
            <SearchBar />
          </Stack>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            flex={1}
            sx={{ minHeight: "0" }}
          >
            <SpanTable />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
