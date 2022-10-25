import { InternalSpan } from "@/model/InternalSpan";
import { Sort } from "@/model/Sort";

const HOST_AND_PORT = "http://localhost:5000"; // TODO: Change to real API, this is a local test server for now

export const fetchSpans = async (
  amt: number,
  start: string,
  key: string,
  sort: Sort[]
) => {
  const response = await fetch(
    `${HOST_AND_PORT}/span?amt=${amt}&start=${start}&key=${key}&sort=${sort}`
  );
  return response.json() as Promise<InternalSpan[]>;
};
