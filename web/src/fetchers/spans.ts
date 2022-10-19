import { InternalSpan } from "@/model/InternalSpan";

const HOST_AND_PORT = "http://localhost:5000" // TODO: Change to real API, this is a local test server for now
const ALL_SPANS_URL = `${HOST_AND_PORT}/span`

export const fetchAllSpans: () => Promise<InternalSpan[]> = async () => {
    const response = await fetch(ALL_SPANS_URL);
    return response.json() as Promise<InternalSpan[]>;
}