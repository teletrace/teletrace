import { Divider } from "@mui/material";
import { Stack } from "@mui/system";

import { Head } from "@/components/Head";

import { SpanTable } from "../components/SpanTable/SpanTable";
import { InternalSpan } from "../../../model/InternalSpan";
import { useQuery } from "@tanstack/react-query";
import { fetchAllSpans } from "@/fetchers/spans";

const SPANS_QUERY_KEY: string = "spans";
const FILTERS_QUERY_KEY: string = "filters";

export const SpanSearch = () => {
  const { data: spans, isLoading } = useQuery<InternalSpan[]>([SPANS_QUERY_KEY], () => fetchAllSpans(), { staleTime: 2000 });
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Head
        title="Span Search"
        description="Designated page to span search's flow graph and timeline"
      />
      <Stack
        direction="column"
        divider={<Divider orientation="horizontal" flexItem />}
        spacing={2}
        sx={{ height: "100%" }}
      >
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          justifyContent="space-between"
          flex={1}
        >
          { isLoading ? <div>Loading...</div> : <SpanTable spans={spans ?? []} /> }
        </Stack>

        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          flex={1}
        ></Stack>
      </Stack>
    </>
  );
};
